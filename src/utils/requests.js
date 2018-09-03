import axios from "axios";
import history from "../history";

const getRequest = async url => {
  try {
    const req = await axios.get(url);
    if (req.data.error) {
      if (req.data.type === "no_login") {
        history.push("/panel/signout");
      }
      console.log(req.data.error);
    }
    return req.data;
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

export { getRequest };
