import axios from "axios"
import { SETTINGS } from "./settings"

export default function isAuthed() {

    let res = true;

    axios.get(new URL("/me",SETTINGS.API_URL).toString(),{
        headers : {
            Authorization : "Bearer " + localStorage.getItem("token")
        }
    }).catch((e) => {
        if (e.status == 401){
            res = false
        }
        else{
            console.log(e);
        }
    })

    return res

}
