import React, { useEffect, useState } from "react";

import api from "../../api";
import routes from "../../routes";
import useAxios from "../../hooks/use-axios";
import { useHistory } from "react-router-dom";
import { authAxios } from "../../config/axios-config";

import { ReactComponent as AuctionIcon } from "../../../src/assets/icons/Auction-Icon.svg";
import ActionsRowTable from "./actions-row-table";

import { Dimmer, Loader } from "semantic-ui-react";

const ExpiredAuctions = () => {
  const [forceReload, setForceReload] = useState(false);
  const onReload = React.useCallback(() => setForceReload((p) => !p), []);

  const [expiredAuctionsData, setExpiredAuctionsData] = useState();

  const history = useHistory();

  const { run, isLoading } = useAxios([]);
  useEffect(() => {
    run(
      authAxios.get(api.app.auctions.getAllexpired).then((res) => {
        setExpiredAuctionsData(res?.data?.data);
      })
    );
  }, [run, forceReload]);

  console.log("====================================");
  console.log(expiredAuctionsData);
  console.log("====================================");

  return (
    <div className="relative ">
      <Dimmer className="animate-pulse" active={isLoading} inverted>
        <Loader active />
      </Dimmer>
      {expiredAuctionsData?.length === 0 ? (
        <div className="flex justify-center mt-32">
          <div>
            <AuctionIcon className="mx-auto" />
            <p className="text-primary-light text-center mt-8 ">
              Ops, there are no Expired auctions yet.<br></br> You can create
              one
            </p>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => history.push(routes.app.createAuction.default)}
                className="text-white text-sm font-normal bg-primary rounded-lg w-32 h-8 "
              >
                Create Now
              </button>
            </div>
          </div>
        </div>
      ) : (
        expiredAuctionsData?.map((e) => (
          <ActionsRowTable
            key={e?.id}
            status={e?.status}
            title={e?.product?.title}
            description={e?.product?.description}
            img={e?.product?.images[0]?.imageLink}
            totalBids={""}
            lastPrice={""}
            endingTime={""}
            goToDetails={routes.app.profile.myAuctions.expiredDetails(e?.id)}
          />
        ))
      )}
    </div>
  );
};

export default ExpiredAuctions;
