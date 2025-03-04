import {Api} from "../api.ts";

export function setupEndpoints() {
    const url = window.location.href;
    const urlParams = new URLSearchParams(new URL(url).search);
    const promotionId = urlParams.get("promotionid") || urlParams.get("promotionId")!;
    const token = urlParams.get("token")!;

    Api.globalBaseUrl = "https://st-greekslotapi.onaim.io";

    Api.setHeader("Authorization", `Bearer ${token}`);
    Api.setCommonQueryParams("promotionId", promotionId);
}