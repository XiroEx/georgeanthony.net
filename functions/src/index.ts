import {initializeApp} from "firebase-admin/app";

initializeApp();

// Export handlers
export {getNewsSummary} from "./handlers/news";
export {quote} from "./handlers/quote";
export {contact} from "./handlers/contact";
export {sendmail} from "./handlers/send";

