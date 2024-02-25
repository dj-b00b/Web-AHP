import axios from "axios";

export const backendUrl = "http://127.0.0.1:8000";

export async function sendRequest(
    url,
    method,
    data,
    authorization = false
) {
    let headers = {
        "Content-Type": "application/json",
    };
    if (authorization) {
        headers["Authorization"] = `Token ${localStorage.getItem("token")}`;
    }

    let response = await axios.request({
        url: url,
        method: method,
        data: data,
        headers: headers,
    });

    return response;
}