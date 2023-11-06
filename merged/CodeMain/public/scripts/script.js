function checkOut(length){
    if(length == 0)
    {
        $.notify("Không có mặt hàng trong giỏ hàng",{className: "warn"});
    }
    else{
        window.location.href = "/checkout";
    }
}