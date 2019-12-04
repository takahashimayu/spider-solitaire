import { Card } from '../script/card.js';
export class Spider extends Card {
    fixed = true;

    constructor(hidden, isJoker, data) {
        super(hidden, isJoker, data);
    }

    // スパイダーソリティア カード初期化
    getInitCardList(type) {
        // カードリストを取得
        let preCardLists = [];
        if (type === 'quadruple') {
            for (let i = 0; i < 2; i++) {
                preCardLists = preCardLists.concat(super.getCardList(true, false));
            }
        } else if (type === 'single') {
            for (let i = 0; i < 8; i++) {
                preCardLists = preCardLists.concat(super.getSingleSuitCardList(true, 'spade'));
            }
        } else if (type === 'double') {
            for (let i = 0; i < 4; i++) {
                preCardLists = preCardLists.concat(super.getSingleSuitCardList(true, 'spade'));
                preCardLists = preCardLists.concat(super.getSingleSuitCardList(true, 'heart'));
            }
        }

        // すべてのカードにfixedを設定する
        for (let i = 0; i < preCardLists.length; i++) {
            preCardLists[i].fixed = true;
        }

        // カードリストをシャッフル
        for (let i = preCardLists.length - 1; i > 0; i--) {
            let r = Math.floor(Math.random() * (i + 1));
            let temp = preCardLists[i];
            preCardLists[i] = preCardLists[r];
            preCardLists[r] = temp;
        }

        // カードリストを再構成
        let cardLists = [];
        let cardList = [];
        for(let i = 0; i < preCardLists.length; i++) {
            cardList.push(preCardLists[i]);
            if (i < 24) {
                if (cardList.length === 6) {
                    cardList[cardList.length - 1].fixed = false;
                    cardList[cardList.length - 1].hidden = false;
                    cardList[cardList.length - 1].img = super.getImg_2(cardList[cardList.length - 1]);
                    cardLists.push(cardList);
                    cardList = [];
                }
            } else if (i < 54) {
                if (cardList.length === 5) {
                    cardList[cardList.length - 1].fixed = false;
                    cardList[cardList.length - 1].hidden = false;
                    cardList[cardList.length - 1].img = super.getImg_2(cardList[cardList.length - 1]);
                    cardLists.push(cardList);
                    cardList = [];
                }
            } else {
                cardList[cardList.length - 1].fixed = false;
                cardList[cardList.length - 1].hidden = false;
                cardList[cardList.length - 1].img = super.getImg_2(cardList[cardList.length - 1]);
                if (cardList.length === 10) {
                    cardLists.push(cardList);
                    cardList = [];
                }
            }
        }
        return cardLists;
    }


}
