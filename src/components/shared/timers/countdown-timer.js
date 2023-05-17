import React from "react";
import useCountdown from "../../../hooks/use-countdown";
import { useLanguage } from "../../../context/language-context";
import content from "../../../localization/content";
import localizationKeys from "../../../localization/localization-keys";

function CountdownTimer({ date }) {
  const [lang] = useLanguage("");
  const selectedContent = content[lang];
  const timeLeft = useCountdown(date);
  const formattedTimeLeft = `${timeLeft.days} ${
    selectedContent[localizationKeys.days]
  } :
  ${timeLeft.hours} ${selectedContent[localizationKeys.hrs]} : 
  ${timeLeft.minutes} ${selectedContent[localizationKeys.min]} `;

  return (
    <div>
      <p>{formattedTimeLeft}</p>
    </div>
  );
}

export default CountdownTimer;
