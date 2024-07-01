import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "SWAP": "SWAP",
      "Connect Wallet": "Connect Wallet",
      "Add liquidity": "Add liquidity",
      "Adding Liquidity": "Adding Liquidity",
      "Amount A": "Amount A",
      "Amount B": "Amount B",
      "Token A address": "Token A address",
      "Token B address": "Token B address",
      "Select a token": "Select a token",
      "Tokens must be swapped by pair, check at": "Tokens must be swapped by pair, check at",
      "Address": "Address",
      "Reserve": "Reserve",
      "Token List": "Token List"
    }
  },
  vi: {
    translation: {
        "SWAP": "ĐỔI",
        "Connect Wallet": "Kết nối ví",
        "Add Liquidity": "Thêm thanh khoản",
        "Adding Liquidity": "Đang thêm thanh khoản",
        "Amount A": "Số lượng A",
        "Amount B": "Số lượng B",
        "Token A address": "Địa chỉ A",
        "Token B address": "Địa chỉ B",
        "Select a token": "Chọn một token",
        "Tokens must be swapped by pair, check at": "Các token phải được đổi theo cặp, kiểm tra tại",
        "Address": "Địa chỉ",
        "Reserve": "Còn",
        "Token List": "Danh sách token"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('lang') || 'en',
    interpolation: {
      escapeValue: false
    }
  });

i18n.on("languageChanged", lng => {
    localStorage.setItem('lang', lng);
  });

  export default i18n;