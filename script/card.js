export class Card {
    numList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    suitList = ["heart", "dia", "club", "spade"];
    hidden = false;
    isJoker = false;
    data = {
        num: 0,
        suit: null
    };
    img = '';

    constructor(hidden, isJoker, data) {
        if (data) {
            this.hidden = hidden;
            this.isJoker = isJoker;
            if (data) {
                this.data.num = data.num;
                this.data.suit = data.suit;
            }
            this.img = this.getImg(hidden, isJoker, data);
        }
    }

    // カード一式を取得
    getCardList(hidden, joker) {
        let cardList = [];
        for (let i = 0; i < this.suitList.length; i++) {
            for (let j = 0; j < this.numList.length; j++) {
                let data = {
                    num: this.numList[j],
                    suit: this.suitList[i]
                };
                cardList.push({
                    hidden: hidden,
                    isJoker: false,
                    data: data,
                    img: this.getImg(hidden, joker, data)
                });
            }
        }
        // jokerを追加
        if (joker) {
            for (let i = 0; i < 2; i++) {
                cardList.push({
                    hidden: hidden,
                    isJoker: true,
                    data: null,
                    img: this.getImg(hidden, joker, null)
                });
            }
        }
        return cardList;
    }

    // 1 single
    // 2 double
    // 3 triple/treble
    // 4 quadruple

    // カード1種類一式を取得
    getSingleSuitCardList(hidden, suit) {
        let cardList = [];
        for (let i = 0; i < this.numList.length; i++) {
            let data = {
                num: this.numList[i],
                suit: suit
            }
            cardList.push({
                hidden: hidden,
                isJoker: false,
                data: data,
                img: this.getImg(hidden, false, data)
            });
        }
        return cardList;
    }

    // IMGを取得
    getImg(hidden, isJoker, data) {
        let img = '';
        // トランプの柄面の場合
        if (hidden) {
            img = 'image/card/back.png';
        } else {
            // Jokerの場合
            if (isJoker) {
                img = 'image/card/joker.png';
            } else {
                img = 'image/card/' + data.suit + '_' + data.num + '.png';
            }
        }
        return img;
    }
    getImg_2(card) {
        return this.getImg(card.hidden, card.isJoker, card.data);
    }
    getImg_3(data) {
        return  this.getImg(false, false, data);
    }

}