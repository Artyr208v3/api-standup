import { sendData } from "./send.js";
export const handleComediansRequest = async (req,res,comedians,id) => {
      if (id) {
        const comedian = comedian.find((c) => c.id === id);
        console.log(comedian);
          if (!comedian) {
            sendError(res, 404, "Stand up комик не найден" );
              return;
          }

          sendData(res, comedian);
          return;
      }

      sendData(res,comedians);
}