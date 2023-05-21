import React, { useEffect, useState } from "react";

import api from "../../api";
import routes from "../../routes";
import useAxios from "../../hooks/use-axios";
import { useHistory } from "react-router-dom";
import { authAxios } from "../../config/axios-config";

import { ReactComponent as AuctionIcon } from "../../../src/assets/icons/Auction-Icon.svg";
import ActionsRowTable from "./actions-row-table";

import { Dimmer, Loader } from "semantic-ui-react";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import PaginationApp from "../shared/pagination/pagination-app";
import { useLanguage } from "../../context/language-context";
import content from "../../localization/content";
import localizationKeys from "../../localization/localization-keys";

const ScheduledAuctions = () => {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);

  const [scheduledAuctionData, setScheduledAuctionData] = useState();
  const [totalPages, setTotalPages] = useState();

  const history = useHistory();
  const { search } = useLocation();

  const { run, isLoading } = useAxios([]);
  useEffect(() => {
    if (search) {
      run(
        authAxios
          .get(
            `${api.app.auctions.getAllOwnesAuctions}${search}&status=IN_SCHEDULED`
          )
          .then((res) => {
            setScheduledAuctionData(res?.data?.data);
            setTotalPages(res?.data?.pagination?.totalPages);
          })
      );
    }
  }, [run, forceReload, search]);

  return (
    <div className="relative">
      <Dimmer className="animate-pulse" active={isLoading} inverted>
        <Loader active />
      </Dimmer>
      <div>
        <p className="pb-5 text-gray-med text-xs font-normal">
          {scheduledAuctionData?.length}{" "}
          {selectedContent[localizationKeys.totalScheduled]}
        </p>
      </div>
      {scheduledAuctionData?.length === 0 ? (
        <div className="flex justify-center mt-32">
          <div>
            <AuctionIcon className="mx-auto" />
            <p className="text-primary-light text-center mt-8 ">
              {selectedContent[localizationKeys.opsScheduled]}
              <br></br> {selectedContent[localizationKeys.youCanCreateOne]}
            </p>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => history.push(routes.app.createAuction.default)}
                className="text-white text-sm font-normal bg-primary rounded-lg w-32 h-8 "
              >
                {selectedContent[localizationKeys.createNow]}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {scheduledAuctionData?.map((e) => (
            <ActionsRowTable
              key={e?.id}
              status={e?.status}
              title={e?.product?.title}
              description={e?.product?.description}
              img={e?.product?.images[0]?.imageLink}
              startingPrice={e?.startBidAmount}
              purchasePrice={""}
              startingDate={e?.startDate}
              goToDetails={routes.app.profile.myAuctions.scheduledDetails(
                e?.id
              )}
            />
          ))}
          <div className="flex justify-end mt-7">
            <PaginationApp totalPages={totalPages} perPage={5} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduledAuctions;
