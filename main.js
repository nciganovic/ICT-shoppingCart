$(document).ready(function(){
    localStorage.removeItem("products");
    console.log("main.js");

    var allData;

    $.ajax({
        url : 'products.json', 
        dataType: 'json',
        method: 'GET',
        success: function(data) { 
            console.log(data);
            allData = data;
            var allProducts = showProductsInHTMLForChecked(data);
            $("#allProducts").html(allProducts);
        },
        error: function(xhr, error, status) {
            console.log(xhr);
        }
    });

    $("#add").click(function(){
        console.log("Add click");

        var allChecked = [];

        $('.cbx:checked').each(function () {
            allChecked.push($(this).attr("name"));
        });

        if(localStorage.getItem("products")){

            getProductIds = JSON.parse(localStorage.getItem("products"));
            for(x of getProductIds){
                allChecked.push(x.id);
            }

            var allObjs = [];
            for(x of allChecked){
                var obj = {
                    id:x
                }
                allObjs.push(obj);
            }
            localStorage.setItem("products", JSON.stringify(allObjs));

        }
        else{
            var allObjs = [];
            for(x of allChecked){
                var obj = {
                    id:x
                }
                allObjs.push(obj);
            }
            
            localStorage.setItem("products", JSON.stringify(allObjs));
        }

        console.log(JSON.parse(localStorage.getItem("products"))); 
        
        
        var checkedData = returnCheckedProducts(allChecked, allData);
        var htmlData = showProductsInHTMLForUnChecked(checkedData);
        $("#addedProducts").html(htmlData);

        var notChekedData = returnNotCheckedProducts(allChecked, allData);
        var htmlData = showProductsInHTMLForChecked(notChekedData);
        $("#allProducts").html(htmlData);
    });


    $("#remove").click(function(){
        console.log("Remove click");

        var allChecked = [];
        var allUnchecked = [];

        $('.cbxr:checked').each(function () {
            allChecked.push($(this).attr("name"));
        });
        $('.cbxr:not(:checked)').each(function () {
            allUnchecked.push($(this).attr("name"));
        });
        

        if(localStorage.getItem("products")){
            var newIdsForLocalStorage = [];
            for(x of allUnchecked){
                var obj = {
                    id: x
                }
                newIdsForLocalStorage.push(obj);
            }
            localStorage.setItem("products", JSON.stringify(newIdsForLocalStorage));

            var getCurrentIds = JSON.parse(localStorage.getItem("products"));

            var currentProducts = [];
            var newIdsForLocalStorage = [];
            
            for(d of allData){
                for(g of getCurrentIds){
                    if(d.id == g.id){
                        currentProducts.push(d);
                    }
                }
            }

            var currentUncheckedProducts = returnNotCheckedProducts(allChecked, currentProducts);
            var currentHTML = showProductsInHTMLForUnChecked(currentUncheckedProducts);
            $("#addedProducts").html(currentHTML);

            var notChekedData = returnNotCheckedProducts(allUnchecked, allData);
            var htmlData = showProductsInHTMLForChecked(notChekedData);
            $("#allProducts").html(htmlData);

        }

    });

    $("#send").click(function(){
        
        if(localStorage.getItem("products")){
            var getAllSelectedIds = JSON.parse(localStorage.getItem("products"));

            if(getAllSelectedIds.length > 0){
                var listIds = [];
                console.log(getAllSelectedIds);
                for(x of getAllSelectedIds){
                    listIds.push(x.id);
                }
        
                var selectedProducts = returnCheckedProducts(listIds, allData);
        
                $.ajax({
                    url:"obrada.php",
                    data:{
                        products: selectedProducts
                    },
                    method:"get",
                    success:function(data){
                        alert("Uspesan unos!");
                    },
                    error: function(err){
                        console.log(err);
                    }
                })
            }
            else{
                alert("Korpa je prazna!");
            }
        }
        else{
            alert("Korpa je prazna!");
        }
    });

});

function showProductsInHTMLForChecked(data){
    var html = "";
    for(d of data){
        html += `<div class="col-12">
                    <input type='checkbox' class="cbx" name='${d.id}' value="${d.id}">${d.ime}
                </div>`
    }

    return html;
}

function showProductsInHTMLForUnChecked(data){
    var html = "";
    for(d of data){
        html += `<div class="col-12">
                    <input type='checkbox' class="cbxr" name='${d.id}' value="${d.id}">${d.ime}
                </div>`
    }

    return html;
}

function returnCheckedProducts(arr, data){
    var specificData = [];
    for(d of data){
        for(x of arr){
            if(d.id == x){
                specificData.push(d);
            }
        }
    }
    return specificData;
}

function returnNotCheckedProducts(arr, data){
    var specificData = [];
    for(d of data){
        var isChecked = false;
        for(x of arr){
            if(d.id == x){
                isChecked = true;
            }
        }
        if(!isChecked){
            specificData.push(d);
        }
    }
    return specificData;
}
