$(function () {

    let wordStorage = {};

    const baseUrl = window.location.href.split("#")[0];

    let buttonAddCategory = document.getElementById("button-addCategory");
    buttonAddCategory.addEventListener("click", addCategory);

    let buttonCheckingWords = document.getElementById("checkWords");
    buttonCheckingWords.addEventListener("click", checkWords);

    let buttonAddWord = document.getElementById("button-addWord");
    buttonAddWord.addEventListener("click", addWord);

    displayCategories();

    //////////////////////////////category////////////////////////////////
    function displayCategories() {
        $.ajax({
            url: `${baseUrl}getAllCategories`, // строка, содержащая URL адрес, на который отправляется запрос

            success: function (data) {

                let divListOfCategory = document.getElementById("list-of-category");

                for (let key in data) {

                    if (data.hasOwnProperty(key)) {
                        let itemOfCategory = document.createElement("div");

                        //let divItemClose = document.createElement("div");
                        let wrapForCloseItem = document.createElement("span");
                        wrapForCloseItem.className = "item-close";
                        let closingMark = document.createElement("i");
                        closingMark.className = "fa fa-times";

                        let rearrangingMark = document.createElement("span");
                        rearrangingMark.className = "rearrange-category";
                        let rearranging = document.createElement("i");
                        rearranging.className = "fa fa-exchange";

                        wrapForCloseItem.appendChild(closingMark);
                        rearrangingMark.appendChild(rearranging);
                        itemOfCategory.appendChild(wrapForCloseItem);
                        itemOfCategory.appendChild(rearrangingMark);

                        wrapForCloseItem.addEventListener("click", deleteCategory);
                        rearrangingMark.addEventListener("click", showEditedCategory);

                        itemOfCategory.addEventListener("mouseover", mouseOverCategory);
                        itemOfCategory.addEventListener("mouseout", mouseOutCategory);

                        let link = document.createElement("a");
                        link.innerHTML = data[key].category;

                        link.setAttribute("href", `${baseUrl}category/${data[key].id}`);
                        link.className = ("list-link");
                        itemOfCategory.className = ("div-link");
                        itemOfCategory.appendChild(link);
                        divListOfCategory.appendChild(itemOfCategory);

                        link.addEventListener("click", function (event) {
                            event.preventDefault();

                            document.getElementsByClassName("category-wrapper")[0].style.display = 'none';
                            document.getElementsByClassName("content__required-info")[0].style.display = 'block';
                            document.getElementsByClassName("add-word")[0].style.display = "block";
                            document.getElementsByClassName("words-wrapper")[0].innerHTML = "";
                            document.getElementsByClassName("words-wrapper")[0].style.display = "block";


                            $.ajax({
                                url: event.currentTarget.href,
                                success: function (data) {
                                    menuDirection();
                                    document.getElementsByClassName("button-submit")[0].style.display = 'block';
                                    let url = this.url.split("/").pop(-1);
                                    wordStorage[url] = data;
                                    displayWords(data);
                                    history.pushState(null, null, baseUrl +'#/category/' + url);
                                }
                            });
                        });
                    }
                }
            }
        });
    }

    function mouseOverCategory() {

        this.style.backgroundColor = "#dcdcdc47";
        this.firstElementChild.style.display = "block";
        this.childNodes[1].style.display = "block";
        this.lastElementChild.style.color = "#720f9c";
    }

    function mouseOutCategory() {
        this.style.backgroundColor = "#ffffff";
        this.firstElementChild.style.display = "none";
        this.childNodes[1].style.display = "none";
        this.lastElementChild.style.color = "#4e01e4";
    }

    function deleteCategory() {
        let category;
        let confirmWindow = confirm("Do you want to delete this item?");

        if (confirmWindow) {

            let item = this.parentElement;
            category = {
                id: this.parentElement.lastElementChild.href.split('/').pop(-1),
                category: this.parentElement.lastElementChild.innerHTML
            };

            $.ajax({
                url: baseUrl + "deleteCategory",
                type: "DELETE",
                contentType: "application/json",
                data: JSON.stringify(category),

                success: function () {
                    item.style.display = "none";

                    // let item = this.parentElement.lastElementChild;
                    // item.style.color = "#d2d2d2";
                },
                error: function (jqXHR, textStatus, error) {
                    alert(error);
                }
            });

        }
    }

    function showEditedCategory() {

        let idCategory;
        document.getElementById("content").addEventListener("click", clickOutsideFotCategory, true);

        document.getElementById("button-addCategory").style.display = "none";
        buttonOfRearrangement(document.getElementsByClassName("add-category"));
        let editingCategory = this.parentElement.lastChild.innerHTML;
        let input = document.getElementById("input-new-type");
        input.value = editingCategory;
        input.focus();

        idCategory = this.parentElement.lastElementChild.href.split('/').pop(-1);

        let buttonRearrangement = document.getElementsByClassName("button-rearrangement")[0];
        buttonRearrangement.addEventListener("click", function () {
            editCategory(idCategory);
        });

    }

    function editCategory(idCategory) {
        let category;

        category = {
            id: idCategory,
            category: document.getElementById("input-new-type").value
        };

        $.ajax({
            url: baseUrl + "editCategory",
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(category),

            success: function (data) {
                let rearrangement = document.getElementsByClassName("list-link");
                    for (let i = 0; i < rearrangement.length; i ++) {
                            if (parseInt(rearrangement[i].href.split('/').pop(-1)) === data.id) {
                                rearrangement[i].innerHTML = data.category;
                        }
                    }
                let inputOfCategory = document.getElementById("input-new-type");
                    inputOfCategory.value = "";

                let parentDiv = document.getElementsByClassName("add-category")[0];
                let buttonRearrangement = document.getElementsByClassName("button-rearrangement")[0];
                parentDiv.removeChild(buttonRearrangement);
                document.getElementById("button-addCategory").style.display = "inline-block";
                document.getElementById("content").removeEventListener("click", clickOutsideFotCategory, true);

            },
            error: function (jqXHR, textStatus, error) {

                alert(error);
            }
        });
    }

    function clickOutsideFotCategory(e) {
        if (!document.getElementById("add-category").contains(e.target)) {
            let inputOfCategory = document.getElementById("input-new-type");
            inputOfCategory.value = "";
            let parentDiv = document.getElementsByClassName("add-category")[0];
            let buttonRearrangement = document.getElementsByClassName("button-rearrangement")[0];
            if (buttonRearrangement) {
                parentDiv.removeChild(buttonRearrangement);
            }
            document.getElementById("button-addCategory").style.display = "inline-block";
            document.getElementById("content").removeEventListener("click", clickOutsideFotCategory, true);
        }
    }

    function addCategory() {

        event.preventDefault();

        let word = {category: document.getElementById("input-new-type").value};

        $.ajax({

            type: "POST",
            url: baseUrl + "addCategory",
            contentType: "application/json",
            data: JSON.stringify(word),

            success: function (data) {

                let inputOfCategory = document.getElementById("input-new-type");
                inputOfCategory.value = "";

                let divListOfCategory = document.getElementById("list-of-category");
                let itemOfCategory = document.createElement("div");

                let wrapForCloseItem = document.createElement("span");
                wrapForCloseItem.className = "item-close";
                let closingMark = document.createElement("i");
                closingMark.className = "fa fa-times";
                wrapForCloseItem.addEventListener("click", deleteCategory);

                let rearrangingMark = document.createElement("span");
                rearrangingMark.className = "rearrange-category";
                let rearranging = document.createElement("i");
                rearranging.className = "fa fa-exchange";

                itemOfCategory.addEventListener("mouseover", mouseOverCategory);
                itemOfCategory.addEventListener("mouseout", mouseOutCategory);

                wrapForCloseItem.appendChild(closingMark);
                rearrangingMark.appendChild(rearranging);
                itemOfCategory.appendChild(wrapForCloseItem);
                itemOfCategory.appendChild(rearrangingMark);

                let link = document.createElement("a");
                link.setAttribute("href", `${baseUrl}category/${data.id}`);
                link.className = ("list-link");
                link.innerHTML = data.category;
                itemOfCategory.className = ("div-link");
                itemOfCategory.appendChild(link);

                divListOfCategory.appendChild(itemOfCategory);

                link.addEventListener("click", function (event) {
                    event.preventDefault();
                    document.getElementsByClassName("category-wrapper")[0].style.display = 'none';
                    document.getElementsByClassName("content__required-info")[0].style.display = 'block';
                    document.getElementsByClassName("add-word")[0].style.display = "block";
                    document.getElementsByClassName("words-wrapper")[0].innerHTML = "";
                    document.getElementsByClassName("words-wrapper")[0].style.display = "block";

                    $.ajax({
                        url: event.currentTarget.href,
                        success: function (data) {
                            menuDirection();

                            let url = this.url.split("/").pop(-1);
                            displayWords(data);
                            document.getElementsByClassName("button-submit")[0].style.display = 'block';

                            location.hash = ("#/category/" + url);
                        }
                    });
                });
            },
            error: function (jqXHR, textStatus, error) {

                alert(error);
            }
        });
    }


    ////////////////////////////////words////////////////////////////////
    function displayWords(data) {

        let parentDiv = document.getElementsByClassName("words-wrapper")[0];
        let div;
        let wrapTheDefinitionAndRequiredSign;
        let definition;
        let requiredSign;
        let erasingMark;
        let rearrangingMark;
        let wordDescription;
        let wordDescriptionHiddenValue;
        let correctWord;
        let fieldOfError;

        menuDirection();

        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                div = document.createElement("div");
                wrapTheDefinitionAndRequiredSign = document.createElement("div");
                requiredSign = document.createElement("span");
                wordDescription = document.createElement("input");

                correctWord = document.createElement("span");
                fieldOfError = document.createElement("p");
                definition = document.createElement("span");
                erasingMark = document.createElement("span");
                let itemClose = document.createElement("i");
                rearrangingMark = document.createElement("span");
                let rearranging = document.createElement("i");


                wordDescriptionHiddenValue = document.createElement("input");
                wordDescriptionHiddenValue.type = "hidden";
                wordDescriptionHiddenValue.className = "view-content__list-item_input-word_hidden-value";
                wordDescriptionHiddenValue.value = data[key].id;

                div.className = "view-content__list-item ";
                wrapTheDefinitionAndRequiredSign.className = "wrap-definition-and-sign";
                definition.className = "definition";
                requiredSign.className = "required-sign ";
                erasingMark.className = "delete-word";
                itemClose.className = "fa fa-times";
                rearranging.className = "fa fa-exchange";
                rearrangingMark.className = "rearrange-word";
                wordDescription.className = "view-content__list-item_input-word";
                correctWord.className = "correctWord";
                fieldOfError.className = "errorRequired";

                definition.innerHTML = data[key].russianWord;
                requiredSign.appendChild(document.createTextNode(" *"));

                erasingMark.appendChild(itemClose);
                erasingMark.addEventListener("click", deleteWord);

                rearrangingMark.appendChild(rearranging);
                rearrangingMark.addEventListener("click", showEditedWord);

                wordDescription.required = true;

                div.addEventListener("mouseover", mouseOverWords);
                div.addEventListener("mouseout", mouseOutWords);

                wordDescription.addEventListener("focus", changeBorderOfWord);
                wordDescription.addEventListener("blur", takeOffColorOfWordBorder);

                wrapTheDefinitionAndRequiredSign.appendChild(definition);
                wrapTheDefinitionAndRequiredSign.appendChild(requiredSign);

                parentDiv.appendChild(div);

                div.appendChild(wrapTheDefinitionAndRequiredSign);

                div.appendChild(erasingMark);
                div.appendChild(rearrangingMark);

                div.appendChild(wordDescription);
                div.appendChild(wordDescriptionHiddenValue);
                div.appendChild(correctWord);
                div.appendChild(fieldOfError);
                parentDiv.style.display = "block";
            }
        }
    }

    function mouseOverWords() {
        this.childNodes[1].style.display = "block";
        this.childNodes[2].style.display = "block";
    }

    function mouseOutWords() {
        this.childNodes[1].style.display = "none";
        this.childNodes[2].style.display = "none";
    }

    function deleteWord() {

        let id_category = window.location.hash.split("/").pop(-1);
        let words = wordStorage[id_category];
        let  id_word = parseInt(this.parentElement.childNodes[4].value);
        let commonWord = this.parentElement.firstElementChild.firstElementChild.innerHTML;
        let erasingWord;

        for (let key in  words) {
            if (words.hasOwnProperty(key)) {
                if (words[key].id === id_word) {

                    erasingWord = {
                        id: words[key].id,
                        id_category: id_category
                    };

                    $.ajax({
                        url: baseUrl + "deleteWord",
                        type: "DELETE",
                        contentType: "application/json",
                        data: JSON.stringify(erasingWord),

                        success: function (data) {
                            deleteHtmlElementOfWord(data.id);

                        },
                        error: function (jqXHR, textStatus, error) {
                            alert(error);
                        }
                    });

                }
            }
        }
    }

    function deleteHtmlElementOfWord(id) {

        let id_category = window.location.hash.split("/").pop(-1);
        let words = wordStorage[id_category];

        for (let key in  words) {
            if (words.hasOwnProperty(key)) {
                if (words[key].id === id) {
                    wordStorage[id_category].splice(key, 1);
                    let parentDiv = document.getElementsByClassName("view-content__list-item ")[key].parentElement;
                    let childDiv = document.getElementsByClassName("view-content__list-item ")[key];
                    parentDiv.removeChild(childDiv);
                }
            }
        }
    }

    function showEditedWord() {

        document.getElementById("content").addEventListener("click", clickOutsideFotWords, true);

        let id_category = window.location.hash.split("/").pop(-1);
        let words = wordStorage[id_category];
        let id_word = parseInt(this.parentElement.childNodes[4].value);

        let editingWord = document.getElementById("englishWord");
        let definition = document.getElementById("russianWord");

        for (let key in  words) {
            if (words.hasOwnProperty(key)) {
                if (words[key].id === id_word) {

                    editingWord.value = words[key].englishWord;
                    definition.value = words[key].russianWord;
                    editingWord.style.borderColor = "#7a28c5c7";
                    definition.style.borderColor = "#7a28c5c7";
                    document.getElementById("button-addWord").style.display = "none";

                    buttonOfRearrangement(document.getElementsByClassName("add-word"));
                    editingWord.focus();
                    let buttonRearrangement = document.getElementsByClassName("button-rearrangement")[0];
                    buttonRearrangement.addEventListener("click", function () {
                        editWord(words[key].id);
                    });
                }
            }
        }


    }

    function editWord(idWord) {

        let id_category = window.location.hash.split("/").pop(-1);
        let words = wordStorage[id_category];
        let object;
        let editingWord = document.getElementById("englishWord");
        let definition = document.getElementById("russianWord");

        object = {
            id: idWord, englishWord: editingWord.value, russianWord: definition.value, id_category: id_category
        };

        if (editingWord.value && definition.value !== "") {


            $.ajax({
                url: baseUrl + "editWord",
                type: "PUT",
                contentType: "application/json",
                data: JSON.stringify(object),

                success: function (data) {
                    if (data === null) {
                        alert("I have already added this word")
                    } else
                        for (let key in words) {
                            if (words.hasOwnProperty(key)) {
                                if (words[key].id === data.id) {
                                    words[key] = data;
                                }
                            }
                        }
                    document.getElementById("content").removeEventListener("click", clickOutsideFotWords, true);
                    cleanValueOfInput();
                    let parentDiv = document.getElementsByClassName("add-word")[0];
                    let buttonRearrangement = document.getElementsByClassName("button-rearrangement")[0];
                    parentDiv.removeChild(buttonRearrangement);
                    document.getElementById("button-addWord").style.display = "inline-block";
                    document.getElementsByClassName("words-wrapper")[0].innerHTML = "";
                    displayWords(words);
                },
                error: function (jqXHR, textStatus, error) {

                    alert(error);
                }
            });

        } else {
            alert("Field(s) is (are) empty");
        }

    }

    function clickOutsideFotWords(e) {

        if (!document.getElementById('add-word').contains(e.target)) {
            cleanValueOfInput();
            let parentDiv = document.getElementsByClassName("add-word")[0];
            let buttonRearrangement = document.getElementsByClassName("button-rearrangement")[0];
            if (buttonRearrangement) {
                parentDiv.removeChild(buttonRearrangement);
            }
            document.getElementById("button-addWord").style.display = "inline-block";
            document.getElementById("content").removeEventListener("click", clickOutsideFotWords, true);
        }
    }

    function changeBorderOfWord() {
        let labelOfRequiredField;

        this.parentNode.childNodes.forEach((el) => {
            if (el.className === 'errorRequired') {
                labelOfRequiredField = el;
            }
        });
        this.style.borderColor = "#0005f8";
        labelOfRequiredField.innerHTML = "";
    }

    function takeOffColorOfWordBorder() {

        let colorError = "#AA0000";
        let labelOfRequiredField;

        // check parentNode, childNodes methods
        // check 'arrow function' in javascript

        this.parentNode.childNodes.forEach((el) => {
            if (el.className === 'errorRequired') {
                labelOfRequiredField = el;
            }
        });

        if (this.value === "") {
            this.style.borderColor = colorError;
            labelOfRequiredField.innerHTML = "This field is obligatory";
        } else {
            this.style.borderColor = "";
            labelOfRequiredField.innerHTML = "";
        }
    }

    function addWord() {
        let key = window.location.hash.split("/").pop(-1);
        let url = document.location.href;

        let editingWord = document.getElementById("englishWord");
        let definition = document.getElementById("russianWord");

        let word = {
            englishWord: document.getElementById("englishWord").value,
            russianWord: document.getElementById("russianWord").value,
            id_category: url.split("/").pop(-1)
        };

        if (editingWord.value && definition.value !== "") {
            $.ajax({
                type: "POST",
                url: baseUrl + "addWord",
                contentType: "application/json",
                data: JSON.stringify(word),

                success: function (data) {

                    if (data != null) {
                        document.getElementsByClassName("words-wrapper")[0].innerHTML = "";
                        wordStorage[key] = data;
                        displayWords(data);
                        cleanValueOfInput();
                    } else {
                        alert("Слово уже добавленно")
                    }
                }
            });
        } else {
            alert("Field(s) is (are) empty")
        }

    }

    function shuffleWords() {

        let inputState = document.getElementsByClassName("view-content__list-item_input-word")[0];
        if (!inputState.disabled) {
            let id_category = window.location.hash.split("/").pop(-1);

            document.getElementsByClassName("words-wrapper")[0].innerHTML = "";
            displayWords(modelShuffle(wordStorage[id_category]));
            cleanValueOfInput();
        }
    }

//////////////////////////////////////////////////////*appService*/////////////////////////////////////////////////////

    function checkWords() {

        let id_category = window.location.hash.split("/").pop(-1);
        let colors = "#000000";
        let colorsForBorder = "#AA0000";

        let enteredWords = [];
        let JSONObjectOfEnteredWords = {};

        let words = document.getElementsByClassName("view-content__list-item_input-word");
        let hiddenValue = document.getElementsByClassName("view-content__list-item_input-word_hidden-value");
        let border = document.getElementsByClassName("view-content__list-item");

        let labelOfRequiredField = document.getElementsByClassName("errorRequired");

        let emptyInput = [];

        for (let i = 0; i < words.length; i++) {

            if (words[i].value === "") {
                emptyInput.push(words[i]);
                border[i].style.color = colors;
                words[i].style.borderColor = colorsForBorder;
                labelOfRequiredField[i].innerHTML = "This field is obligatory";

            } else
                enteredWords.push({id: hiddenValue[i].value, englishWord: words[i].value});
            JSONObjectOfEnteredWords[id_category] = enteredWords;
        }

        if (emptyInput.length) {
            emptyInput[0].focus();
            return;
        }

        //console.log(enteredWords);

        $.ajax({

            type: "POST",
            url: baseUrl + "checkWords",
            contentType: "application/json",
            data: JSON.stringify(JSONObjectOfEnteredWords),
            //data: data,
            crossDomain: true,

            success: function (data) {
debugger;
                showResult(data);
            }
        });
    }

    function showResult(data) {

        let colors = "#AA0000";
        let colorGreen = "#059c28";
        let iterator = 0;

        let id_category = window.location.hash.split("/").pop(-1);
        let words = wordStorage[id_category];
        let nameOfWord = document.getElementsByClassName("view-content__list-item");
        let inputDisable = document.getElementsByClassName("view-content__list-item_input-word");

        let correctAnswer = document.getElementsByClassName("correctWord");
        let definition = document.getElementsByClassName("definition");
        let requiredSign = document.getElementsByClassName("required-sign");

        let labelOfTotalPoint = document.getElementById("totalPoints");
        document.getElementsByClassName("add-word")[0].style.display = "none";

        let amountOfCorrectAnswers = 0;

        let idWord = document.getElementsByClassName("view-content__list-item_input-word_hidden-value");

        for (let i = 0; i < nameOfWord.length; i++) {
            let value = data[idWord[i].value];
            if (value){
                amountOfCorrectAnswers++;
                labelOfTotalPoint.textContent = amountOfCorrectAnswers + "/" + Object.keys(data).length;

                nameOfWord[i].className += "view-content__list-item_checkMark onePointForAnswer ";
                definition[i].style.color = colorGreen;
                inputDisable[i].disabled = true;
                requiredSign[(i + 1)].style.display = "none";
            } else {
                labelOfTotalPoint.textContent = amountOfCorrectAnswers + "/" + Object.keys(data).length;
                nameOfWord[i].className += "view-content__list-item_crossMark zeroPointForAnswer";
                definition[i].style.color = colors;
                correctAnswer[i].innerHTML = words[i].englishWord;
                inputDisable[i].disabled = true;
                requiredSign[(i + 1)].style.display = "none";
            }
            document.body.scrollTop = document.documentElement.scrollTop = 0;
            labelOfTotalPoint.style.display = "block";
        }
    }

    function menuDirection() {
        document.getElementsByClassName("menu")[0].style.display = "block";
        if (!document.getElementsByClassName("list-menu").length) {
            let menu = document.getElementsByClassName("menu")[0];

            let buttonBackToTheMainMenu = document.createElement("div");
            let buttonRestart = document.createElement("div");
            let buttonShuffle = document.createElement("div");

            buttonBackToTheMainMenu.className = ("list-menu");
            buttonRestart.className = ("list-menu");
            buttonShuffle.className = ("list-menu");

            buttonBackToTheMainMenu.id = "list-item-home";
            buttonRestart.id = "list-item-restart";
            buttonShuffle.id = "list-item-shuffle";

            let menuFont = document.createElement("i");
            let replyFont = document.createElement("i");
            let shuffleFont = document.createElement("i");

            menuFont.className = "fa fa-home";
            replyFont.className = "fa fa-repeat";
            shuffleFont.className = "fa fa-random";

            buttonBackToTheMainMenu.appendChild(menuFont);
            buttonRestart.appendChild(replyFont);
            buttonShuffle.appendChild(shuffleFont);

            menu.appendChild(buttonBackToTheMainMenu);
            menu.appendChild(buttonRestart);
            menu.appendChild(buttonShuffle);

            let menuItemBackToMenu = document.getElementById("list-item-home");
            menuItemBackToMenu.addEventListener("click", getCategory);

            let menuItemRestart = document.getElementById("list-item-restart");
            menuItemRestart.addEventListener("click", restart);

            let menuItemShuffle = document.getElementById("list-item-shuffle");
            menuItemShuffle.addEventListener("click", shuffleWords);
        }
    }

    function buttonOfRearrangement(parentDiv) {
        let div = document.createElement("div");
        div.className = ("button-rearrangement fa fa-repeat");
        parentDiv[0].appendChild(div);
    }

    function modelShuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function restart() {

        let id_category = window.location.hash.split("/").pop(-1);

        let inputState = document.getElementsByClassName("view-content__list-item_input-word");
        if (!inputState.disabled) {
            document.getElementsByClassName("words-wrapper")[0].style.display = "block";
            document.getElementsByClassName("words-wrapper")[0].innerHTML = "";
            document.getElementsByClassName("total-point-view")[0].style.display = "none";
            document.getElementsByClassName("add-word")[0].style.display = "block";
            displayWords(wordStorage[id_category]);
            cleanValueOfInput();

        }
    }

    function getCategory() {
        document.getElementsByClassName("category-wrapper")[0].style.display = 'block';
        document.getElementsByClassName("content__required-info")[0].style.display = 'none';
        document.getElementsByClassName("add-word")[0].style.display = "none";
        document.getElementsByClassName("words-wrapper")[0].style.display = "none";
        document.getElementsByClassName("menu")[0].style.display = "none";
        document.getElementsByClassName("button-submit")[0].style.display = "none";
        document.getElementsByClassName("total-point-view")[0].style.display = "none";
        cleanValueOfInput();
        history.pushState(null, null, baseUrl);
    }

    function getKeptWords() {
        let idCategory = window.location.hash.split('/').pop(-1);
        document.getElementsByClassName("words-wrapper")[0].innerHTML = "";
        document.getElementsByClassName("words-wrapper")[0].style.display = "block";
        displayWords(wordStorage[idCategory]);
    }

    function navigationTo() {
        if (!window.location.hash) {
            document.getElementsByClassName("category-wrapper")[0].style.display = 'block';
            document.getElementsByClassName("content__required-info")[0].style.display = 'none';
            document.getElementsByClassName("add-word")[0].style.display = "none";
            document.getElementsByClassName("words-wrapper")[0].style.display = "none";
            document.getElementsByClassName("menu")[0].style.display = "none";
            document.getElementsByClassName("button-submit")[0].style.display = "none";
            document.getElementsByClassName("total-point-view")[0].style.display = "none";
        } else {
            document.getElementsByClassName("category-wrapper")[0].style.display = 'none';
            document.getElementsByClassName("content__required-info")[0].style.display = 'block';
            document.getElementsByClassName("add-word")[0].style.display = "block";
            document.getElementsByClassName("menu")[0].style.display = "block";
            document.getElementsByClassName("button-submit")[0].style.display = "block";
            cleanValueOfInput();
            getKeptWords();
        }

    }

    function cleanValueOfInput() {
        let editingWord = document.getElementById("englishWord");
        let definition = document.getElementById("russianWord");
        editingWord.value = "";
        definition.value = "";
        editingWord.style.borderColor = "";
        definition.style.borderColor = "";
    }

    document.onmouseover = function () {
        window.innerDocClick = true;
    };
    document.onmouseleave = function () {

        window.innerDocClick = false;
    };
    window.onhashchange = function () {

        if (window.innerDocClick) {

            window.innerDocClick = false;

        } else {
            navigationTo();
        }
    };
});