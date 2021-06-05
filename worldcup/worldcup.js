var candidate =["오징어볶음","낚지무침","민트초코","짜장면","파인애플피자","지코","마라탕","탕수육"];

var round =candidate.length/2;// n/2강 
var phase =0;// 한 강 안에서의 횟수
var selectlist = document.querySelectorAll(".select");
var selectButtons = Array.prototype.slice.call(selectlist);
var nextroundCandidate = [];
var curroundCandidate = candidate;
console.log(selectButtons)

refreshCandidate();



$(".select1").on("click",function(){
    //alert("button1");
    nextroundCandidate.push(curroundCandidate[phase*2]);
    buttonclicked();
})
$(".select2").on("click",function(){
    //alert("button2");
    
    nextroundCandidate.push(curroundCandidate[phase*2+1]);
    buttonclicked();
})

function buttonclicked(){
    phase++;
    if(phase>=round){
        phase =0;
        
        if(round<=1){
            alert(nextroundCandidate[0]+" 이 우승했습니다");
            return;
        }
        round = round/2;
        curroundCandidate = nextroundCandidate;
        nextroundCandidate =[];
        refreshCandidate();
    }
    refreshCandidate();
}

function refreshCandidate(){
    $(".content1").text(curroundCandidate[phase*2]);
    
    $(".content2").text(curroundCandidate[phase*2+1]);

    $(".curTitle").text(round*2+"강 "+(phase+1)+"/"+round);
}

$('#restart').click(function() {
    location.reload();
});

$('#back').click(function() {
    //뒤로가기 코드
});