$(function () {
	$("#cell-news").tabs();
});

document.getElementById('tab1').onclick = changecolor(1);
document.getElementById('tab2').onclick = changecolor(2);
document.getElementById('tab3').onclick = changecolor(3);
function changecolor(n){
	if(n == 1){
		document.getElementById('tab1').style.backgroundColor = "red";
	}
	else if(n == 2){
		document.getElementById('tab2').style.backgroundColor = "red";
	}
	else{
		document.getElementById('tab3').style.backgroundColor = "red";
	}
	return false;
}