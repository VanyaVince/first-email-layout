<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>quiz</title>
    <link rel="stylesheet" href="./categoryStyles.css">
    <link rel="stylesheet" href="./wordsStyle.css">
</head>
<body>
<div class="header">
</div>

<div class="content" id="content">

    <div class="content-box">

        <div class="content__line-design"></div>
        <div class="content__box-value">

            <div class="category-wrapper">
                <div class="add-category" id="add-category">
                    <#--<span>new list</span>-->
                    <input class="input-new-type" id="input-new-type" type="text" placeholder="add category" title="add category">
                        <span class="button-add fa fa-plus" id="button-addCategory" style= "color:green"></span>
                    <#--<button id="getList"><a>get it</a></button>-->
                </div>
                <div class="list-of-category" id="list-of-category"></div>
            </div>

            <div class="word-item">

                <div class="menu"></div>

                <div class="content__required-info">This field is required
                    <span class="required-sign"> *</span>
                </div>

                <div class="add-word" id="add-word">
                    <span class="add-word_title">new one</span>
                    <input class="input-new-word" id="englishWord" type="text" placeholder="a word" title="englishWord">
                    <input class="input-new-word" id="russianWord" type="text" placeholder="the meaning" title="russianWord">
                    <span class="button-add fa fa-plus" id="button-addWord" style= "color:green"></span>
                </div>

                <div class="total-point-view" id="totalPoints"></div>

                <div class="words-wrapper"></div>
                <button id="checkWords" class="button-submit">Submit</button>
            </div>
        </div>
        <!--<div class="content__line-design"></div>-->
    </div>
</div>
<!--<div class="footer"></div>-->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<script type="text/javascript" src="script.js" async></script>

</body>
</html>