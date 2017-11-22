import { Home_DATA } from '../../Actions/Home/homeAction';
import { CLEAR_STATE_VALUE,ERROR_5XX} from "../../Actions/Helpers/helper";

export default function reducer(state={
    data: null,
    fetching: true
  }, action) {

  switch(action.type) {
    case Home_DATA:
        return action.payload;
    case CLEAR_STATE_VALUE:
      return null;
    case ERROR_5XX:
      return null;
  }
  return state;
}