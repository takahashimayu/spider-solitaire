import { Card } from '../script/card.js';
import { Spider } from '../script/spider.js';
$(function(){
    let card_lists = [];    // カードリスト配列

    // htmlを初期化
    initHtml();

    // sortableの初期設定
    initSortable();

    // card-stock-listクラスクリック時
    let cardStockLists = document.querySelector('.card-stock-list');
    cardStockLists.addEventListener('click', function(){
        let cardItems = this.getElementsByClassName('card-item');
        // カードアイテムが存在しない場合、何も行わない
        if (cardItems.length === 0) {
            return;
        } else {
            // カードを配る
            distribute(cardItems);

            // ストックカードアイテムを一つ取り除く
            cardItems[0].remove();
        }
    }, false);

    // htmlを初期化（card-listsクラス内にhtmlを追加）
    function initHtml() {
        // カードリストを取得
        let spider = new Spider();
        card_lists = spider.getInitCardList();

        let html = '';
        for(let i = 0; i < 10; i++) {

            // card-itemクラスの要素を生成する
            let cardItems = '';
            cardItems += createCardItem(card_lists[i]);

            // card-listクラスの要素を生成する
            html += '<div class="card-list nested-sortable">';
            html +=     cardItems;
            html += '</div>';
        }

        // card-listsクラス内にhtmlを追加する
        let cardLists = document.querySelector('.card-lists');
        cardLists.innerHTML = html;

        // card-itemクラスの生成
        function createCardItem(cardList, idx = 0) {

            // クラス名を取得
            let className = '';
            if (cardList[idx].hidden) className += 'card-hidden ';
            if (cardList[idx].fixed) className += 'fixed ';
            if (idx + 1 === cardList.length) className += 'lead-card';

            let html = '';
            html += '<div class="card-item ' + className + '">';
            html += '<img src="' + cardList[idx].img + '" alt="card" ';
            html +=   'data-num="' + cardList[idx].data.num + '" data-suit="' + cardList[idx].data.suit + '">';
            html += '<div class="nested-sortable">';

            // 子カードがある場合
            if (idx < cardList.length - 1){
                let nextIdx = idx + 1;
                html += createCardItem(cardList, nextIdx);
            }

            html += '</div>';
            html += '</div>';

            return html;
        }
    }

    // sortableの初期設定
    function initSortable() {
        let nestedSortables = document.querySelectorAll('.nested-sortable');
        for (let i = 0; i < nestedSortables.length; i++) {
            new Sortable(nestedSortables[i], {
                group: {
                    name: 'nested'
                },
                animation: 200,
                filter: '.fixed',
                onAdd: (evt) => {
                    onAdd(evt);
                }
            });
        }

        // onAdd処理
        function onAdd(evt) {
            let item = evt.item.querySelector('img');
            let to = evt.to.parentNode.querySelector('img');
            let isEmptyBox = evt.to.classList.contains('card-list') && !evt.to.hasChildNodes();
            // 移動可能か判定する
            // 空カードリストの場合
            if (evt.to.classList.contains('card-list') && evt.to.classList.contains('lead-card')) {
                // 移動後の処理
                afterAddCard(evt);
            // 移動先のlead-cardクラス かつ 数字が一つ大きい場合
            } else if (Number(item.dataset.num) + 1 === Number(to.dataset.num) &&
             evt.to.parentNode.classList.contains('lead-card')) {
                // 移動後の処理
                afterAddCard(evt);
            } else {
                // 移動できない場合、元の位置に戻る
                $(evt.from).append(evt.item);
            }

            // 移動後の処理
            function afterAddCard(evt) {
                // カードをめくる
                let nextLeadCard = evt.from.parentNode.querySelector('img');
                let cardData = {
                    suit: nextLeadCard.dataset.suit,
                    num: nextLeadCard.dataset.num
                };
                let card = new Card();
                nextLeadCard.setAttribute('src', card.getImg_3(cardData));

                // めくった先のカードのクラス名を設定する
                if (!evt.from.hasChildNodes()) {
                    evt.from.classList.add('lead-card');
                } else {
                    evt.from.parentNode.classList.add('lead-card');
                }
                evt.from.parentNode.classList.remove('card-hidden');
                resetFixedClass(evt.from);

                // 追加先のクラス名を再設定する
                evt.to.parentNode.classList.remove('lead-card');
                resetFixedClass(evt.to);

                // 同じマークのカードがエースからキングまで揃った場合
                let TargetCardList = getParentElement(evt.to, 'card-list');
                let notFixedItems = TargetCardList.querySelectorAll('.card-item:not(.fixed)');
                if (notFixedItems.length === 13) {
                    notFixedItems[0].remove();
                }
            }
        }
    }

    // カードを配る
    function distribute(ele) {
        // 配るカードリストを取得する
        let length = ele.length;
        let targetCardList = card_lists[9 + length];

        // 空リストには配れないように制御
        let cardLists = document.querySelectorAll('.card-list');
        for (let i = 0; i < cardLists.length; i++) {
            if(!cardLists[i].hasChildNodes()) {
                return alert('カードが配れません');
            }
        }

        // カードを配る
        let leadItem = document.querySelectorAll('.lead-card');
        for (let i = 0; i < leadItem.length; i++) {
            // card-item要素を生成し、追加
            let nestedSortableDiv = leadItem[i].querySelector('.nested-sortable');
            nestedSortableDiv.innerHTML = createCardItem(targetCardList, i);
        }

        // lead-cardクラスの設定
        let cardItems = document.getElementsByClassName('card-item');
        for (let i = 0; i < cardItems.length; i++) {
            cardItems[i].classList.remove('lead-card');
            cardItems[i].classList.replace('new-card', 'lead-card');
        }

        // leadItemのクラス名を設定する
        for (let i = 0; i < leadItem.length; i++) {
            resetFixedClass(leadItem[i]);
        }

        // Sortable.jsを初期化
        initSortable();

        // htmlを生成する
        function createCardItem(targetCardList, idx) {
            let html = '';
            html += '<div class="card-item new-card">';
            html += '<img src="' + targetCardList[idx].img + '" alt="card" ';
            html +=   'data-num="' + targetCardList[idx].data.num + '" data-suit="' + targetCardList[idx].data.suit + '">';
            html += '<div class="nested-sortable">';
            html += '</div>';
            html += '</div>';
            return html;
        }
    }

    // 対象要素から遡って特定のクラス名を持つ親要素を取得する
    function getParentElement(ele, targetClassName) {
        let isTarget = ele.classList.contains(targetClassName);
        if (isTarget) {
            return ele;
        } else {
            return getParentElement(ele.parentNode, targetClassName);
        }
    }

    // fixedクラスの設定
    function resetFixedClass(ele) {
        let cardListBase = getParentElement(ele, 'card-list');
        let cardItems = cardListBase.querySelectorAll('.card-item');
        let isBeforeFixed, beforeSuit, beforeNum;
        for (let i = cardItems.length - 1; i > -1; i--) {
            // カードが裏絵の場合
            if (cardItems[i].classList.contains('hidden')) {
                cardItems[i].classList.add('fixed');
            } else {
                // カードが先頭の場合
                if (cardItems[i].classList.contains('lead-card')) {
                    cardItems[i].classList.remove('fixed');
                // 前のカードがfixedクラスを含まれない かつ 前のカードのマークが一緒 かつ
                // 前のカードより値が一つ大きい場合
                } else if (!isBeforeFixed && beforeSuit === cardItems[i].querySelector('img').dataset.suit &&
                 Number(beforeNum) + 1 === Number(cardItems[i].querySelector('img').dataset.num)) {
                    cardItems[i].classList.remove('fixed');
                // その他の場合
                } else {
                    cardItems[i].classList.add('fixed');
                }
            }
            // 前のカードの値を設定
            isBeforeFixed = cardItems[i].classList.contains('fixed');
            beforeSuit = cardItems[i].querySelector('img').dataset.suit;
            beforeNum = cardItems[i].querySelector('img').dataset.num;
        }

    }
});

