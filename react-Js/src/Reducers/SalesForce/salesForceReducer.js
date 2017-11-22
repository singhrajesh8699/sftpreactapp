import { SALESFORCE_DATA } from '../../Actions/SalesForce/salesForceAction';
import { CLEAR_STATE_VALUE,ERROR_5XX} from "../../Actions/Helpers/helper";

export default function reducer(state={
    data: null,
    fetching: true
  }, action) {

  switch(action.type) {
    case SALESFORCE_DATA:
      return action.payload;
    case CLEAR_STATE_VALUE:
      return null;
    case ERROR_5XX:
      return null;
  }
  return state;
}