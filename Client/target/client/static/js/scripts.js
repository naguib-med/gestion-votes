let myToken;
var userLogin;
let indexTemplate;
let ballotTemplate;

let nameCandidat;

let ballotId;
let isVoted = false;




$(window).bind('load', () => {
    indexTemplate = $('#index').prop('innerHTML');
    ballotTemplate = $('#template_vote').prop('innerHTML');
    routage(location.hash);

    showNamesCandidats();

    if(!myToken) {
        location.hash = "index";
        $("#ifConnected").hide();
        $("#ifNotConnected").show();
    }
    else if(myToken) {
        $("#ifNotConnected").hide();
        $("#ifConnected").show();
        $('#delete').hide();
    }
});

$(window).bind('hashchange', () => {

    let url = location.hash.split("/")[0];
    if ( url === "#candidat"){
        routage(location.hash.split("/")[0]);
        return;
    }

    showNamesCandidats();

    if(!myToken && location.hash === "index") {
        $("#connect").show();
        $("#vote").hide();
        $("#ballot").hide();
        $("#deco").hide();
        $("#candidats").hide();
        $('#delete').hide();
        return;
    }if(myToken && url === "#ballot" ){
        $("#havedConnected").hide();
        $("#ballot").show();
    }
    if(!myToken  && url === "#ballot"){
        $("#index").hide();
        $("#havedConnected").show();
        return;
    }

    if(myToken && url === "#vote" ){
        $("#havedConnected").hide();
        $("#vote").show();
    }

    if(!myToken && url === "#vote"){
        $("#index").hide();
        $("#havedConnected").show();
        return;
    }

    if(myToken && url === "#monCompte" ){
        $("#havedConnected").hide();
        $("#monCompte").show();
    }

    if (!myToken && url === "#monCompte"){
        $("#index").hide();
        $("#havedConnected").show();
    }
    else {
        routage(location.hash);
    }

});



function routage(route) {
    $("section").each( function() {
        $(this).hide();
    });
    $(route).show();
}



function retour() {
    $("#havedConnected").hide();
    $("#index").show();
    location.hash = "index";
    routage(location.hash);
}


setInterval(function(){
    // Fetch pour afficher les resulats

    fetch('https://192.168.75.56/api/v3/election/resultats')
        .then(resp => {
            if(resp.ok){
                resp.json().then(data => {
                    let listElection = {listElection : data};
                    var template = $('#mp_template').html();
                    var html = Mustache.render(template, listElection);
                    $('#mypanel_election').html(html);
                })
            }
        })
        .catch(function(error) {
            alert("Il y a eu un problème avec l'opération fetch: " + error.message, "danger");
        });
}, 3000);


async function loginFunct() {
    let cb = document.getElementById("adminForm");
    // isVoted = false;
    let request = {
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            login: $('#loginForm').val(),
            nom: $('#nomForm').val(),
            admin: cb.checked
        })
    };


    (function () {
        'use strict'
        var forms = document.querySelectorAll('.needs-validation')
        Array.prototype.slice.call(forms)
            .forEach(function (form) {
                form.addEventListener('submit', async function (event) {
                    if (!form.checkValidity()) {
                        event.preventDefault()
                        event.stopPropagation()
                    } else {
                        await fetch('https://192.168.75.56/api/v3/users/login', request)
                            .then(response => {
                                let login;
                                let Name;
                                if (response.ok) {
                                    login = $('#loginForm').val();
                                    Name = $('#nomForm').val();

                                    let view = {view :{
                                            "myName" : Name
                                        }};

                                    var template = $('#nameCompte').html();
                                    var html = Mustache.render(template, view);
                                    $('#UserName').html(html);

                                    userLogin = login;

                                    myToken = response.headers.get('Authorization').replace("Bearer ", "");

                                    const reqete = {
                                        method: 'get',
                                        headers: new Headers({
                                            'Content-Type': 'application/json',
                                            'Authorization': myToken
                                        })
                                    };

                                    fetch('https://192.168.75.56/api/v3/election/ballots/byUser/'+userLogin, reqete)
                                        .then(res => {
                                            if (res.ok) {
                                                isVoted = true;
                                            }
                                        })
                                        .catch(function(error) {
                                            alert("Il y a eu un problème avec l'opération fetch: " + error.message, "danger");
                                        });

                                    if (isVoted === false)
                                    {
                                        var myContent =  document.getElementById("affVote");
                                        myContent.innerHTML = "You have not yet voted.";
                                    }
                                    else{
                                        var myConten =  document.getElementById("affVote");
                                        myConten.innerHTML = "It's the information of your vote.";
                                    }

                                    routage(location.hash = "index");
                                    $("#index").show();
                                    $("#connect").hide();
                                    $("#ifNotConnected").hide();
                                    $("#ifConnected").show();
                                    showNamesCandidats();
                                }
                                else{
                                    alert("an error occurred while connecting. Try Again !","warning");
                                }
                            })
                            .catch(function(error) {
                                alert("Il y a eu un problème avec l'opération fetch: " + error.message, "danger");
                            });
                    }

                    form.classList.add('was-validated')
                }, false)
            })
    })()

}




//  Pour afficher les noms des candidats

function showNamesCandidats(){
    fetch('https://192.168.75.56/api/v3/election/candidats/noms')
        .then(resp => {
            if(resp.ok){
                resp.json().then(data => {
                    let listcandidat = {listcandidat : data};
                    var template = $('#template_cand').html();
                    var html = Mustache.render(template, listcandidat);
                    $('#mypanel_cand').html(html);

                    var template2 = $('#template_nom').html();
                    var html2 = Mustache.render(template2, listcandidat);
                    $('#mypanel_nom').html(html2);

                })
            }
        })
        .catch(function(error) {
            alert("Il y a eu un problème avec l'opération fetch: " + error.message, "danger");
        });

}



// La fonction qui permet de recuperer les informations d'un utilisateur

function getUser() {
    const request = {
        method: 'get',
        headers: new Headers({
            'Accept': 'application/json',
            'Authorization':  myToken
        }),
    };
    fetch("https://192.168.75.56/api/v3/users/"+ userLogin, request)
        .then(response => {
            console.log(myToken);
            if(response.ok){
                response.json().then(function (data) {
                    console.log(data)
                    location.hash = 'monCompte';
                    var infoUser = {infoUser: data};
                    var template = $('#compteList').html();
                    var html = Mustache.render(template, infoUser);
                    $('#myPanelCompte').html(html);
                })

            } else if(response.status === 401 ){
                alert("You must log in !","warning");
            }
            else if(response.status === 403){
                alert("User not administrator or not logged in", "warning");
            }
            else if(response.status === 404){
                alert("User not found", "warning");
            }

        })
        .catch(function(error) {
            alert("Il y a eu un problème avec l'opération fetch: " + error.message, "danger");
        });

}









function afficheCand(obj){

    // alert(obj.getAttribute("href").split('/'));
    nameCandidat = obj.getAttribute("href").split('/')[1];
    console.log(nameCandidat);
    // location.hash = 'candidat/'+nameCandidat;
    // window.location.hash.replace('#','#candidat'+nameCandidat);

    const request = {
        method: 'get',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization':  myToken
        }),
    };

    fetch('https://192.168.75.56/api/v3/election/candidats/'+nameCandidat, request)
        .then(resp => {
            if (resp.ok){
                console.log(resp);
                resp.json().then(data => {
                    console.log(data);
                    let nomsCandidat= {nomsCandidat: data};
                    var template = $('#template_afficheC').html();
                    var html = Mustache.render(template, nomsCandidat);
                    $('#infoCandidat').html(html);
                })
            }
            else if(resp.status === 401){
                console.log('connectez vous')
                $("#candidat").hide();
                alert("You must log in !","warning");

            }
            else if(resp.status === 404){
                alert("User not found", "warning");
            }
        })
        .catch(function(error) {
            alert("Il y a eu un problème avec l'opération fetch: " + error.message, "danger");
        });


}



// logout utilisateur
function logout() {
    const request = {
        method: 'post',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': myToken
        })
    };
    fetch("https://192.168.75.56/api/v3/users/logout", request)
        .then(response => {
            if (response.ok){
                myToken = undefined;
                userLogin = undefined;
                location.hash = "index";
                $("#ifConnected").hide();
                $("#ifNotConnected").show();
                $("#connect").show();
                $('#loginForm').val('');
                $('#nomForm').val('');
                // let html = Mustache.render(indexTemplate," ");
                // $('#'+location.hash.replace('#', '')).html(html);
            }
        })
        .catch(function(error) {
            alert("Il y a eu un problème avec l'opération fetch: " + error.message, "danger");
        });


}


function vote(){
    if (isVoted === true){
        $('#voteConfirmationModal').modal('hide')
        $('#VoteModal').modal('show')
    }
    else{
        $('#VoteModal').modal('hide')
        $('#voteConfirmationModal').modal('show')
    }
}


function voteFunct(){
    if (isVoted === false){

        let nom;
        let tabElection = [];
        let request = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization':  myToken
            }),
            body: JSON.stringify({
                nomCandidat: $('#candidatBy').val()
            })
        };


        fetch('https://192.168.75.56/api/v3/election/resultats')
            .then(resp => {
                if(resp.ok){
                    resp.json().then(data => {
                        for (let i=0 ; i < data.length; i++){
                            tabElection[i] = data[i];
                        }
                        var listElection = {listElection: data};
                        var template = $('#mp_template').html();
                        var html = Mustache.render(template, listElection);
                        $('#mypanel').html(html);
                    })
                }
            })
            .catch(function(error) {
                alert("Il y a eu un problème avec l'opération fetch: " + error.message, "danger");
            });

        fetch('https://192.168.75.56/api/v3/election/ballots', request)
            .then(response => {
                if (response.ok) {
                    nom = $('#candidatBy').val();

                    for (let i=0 ; i < tabElection.length; i++){
                        if (tabElection[i].nomCandidat === nom)
                            tabElection[i].votes += 1;
                    }

                    isVoted = true;

                    alert('Nice, your vote has been registered successfully !', 'success')
                    getBallotByUser();
                } else if(response.status === 400) {
                    alert("Unacceptable query parameters", "warning");
                }
                else if(response.status === 401){
                    alert("You must log in !","warning");
                }
            })
            .catch(function(error) {
                alert("Il y a eu un problème avec l'opération fetch: " + error.message, "danger");
            });



    }
    else{
        $('#VoteModal').modal('show');
    }
}


function getBallotByUser(){

    if(isVoted === true){
        const req = {
            method: 'get',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': myToken
            })
        };

        var myConten =  document.getElementById("affVote");
        myConten.innerHTML = "It's the information of your vote.";

        fetch('https://192.168.75.56/api/v3/election/ballots/byUser/'+userLogin, req)
            .then(resp => {
                if (resp.ok) {
                    isVoted = true;
                    resp.json().then(data => {
                        // console.log(data.id.split('/')[2]);
                        ballotId = data.id.split('/')[2];
                        var infoVote = {infoVote : {
                                "votant" : data.votant,
                                "id" : data.id.split('/')[2]
                            }};
                        // console.log(infoVote.infoVote.id.split('/')[2]);
                        var template = $('#template_vote').html();
                        var html = Mustache.render(template, infoVote);
                        $('#myPanelVote').html(html);
                    });
                }
                else if(resp.status === 401 ){
                    alert("You must log in !","warning");
                }
                else if(resp.status === 403){
                    alert("You cannot consult because you are neither an administrator nor an owner of the vote", "warning");
                }
                else if(resp.status === 404){
                    alert("User or ballot not found", "warning");
                }
            })
            .catch(function(error) {
                alert("Il y a eu un problème avec l'opération fetch: " + error.message, "danger");
            });
    }
    else {
        console.log("ca doit s afficher");
        var myContent =  document.getElementById("affVote");
        myContent.innerHTML = "You have not yet voted.";
    }


}



let nameChanged;
function changeName(){
    $('#newName').keyup(function(event) {
        $('#nameUser').text($(this).val());
        nameChanged = $(this).val();
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("myBtn").click();
        }
    });

    $('#changeName').keyup(function() {
        $('#nameUser').text($(this).val());
        nameChanged = $(this).val();
    });

}



function alert(message, type) {
    let wrapper = document.createElement('div')
    wrapper.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-mdb-dismiss="alert" aria-label="Close"></button></div>'
    let alertPlaceholder = document.getElementById('liveAlertPlaceholder');
    alertPlaceholder.append(wrapper)
}



function updateName() {
    const request = {
        method: 'put',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization':  myToken
        }),
        body: JSON.stringify({
            nom: nameChanged,
        })
    };

    fetch("https://192.168.75.56/api/v3/users/"+ userLogin+"/nom", request)
        .then(response => {
            if(response.ok){
                console.log("modifié")
                alert('Nice, your name has been successfully changed !', 'success')
            }
            else if (response.status === 400){
                alert("Unacceptable request parameters", "warning");
            }
            else if(response.status === 401 ){
                alert("You must log in !","warning");
            }
            else if(response.status === 403){
                alert("User not administrator or not logged in", "warning");
            }
            else if(response.status === 404){
                alert("User not found", "warning");
            }
        })
        .catch(function(error) {
            alert("Il y a eu un problème avec l'opération fetch: " + error.message, "danger");
        });

}


//  la fonction pour supprimer un vote

function deleteVote(){
    if(isVoted !== false){
        $('#noVoteModal').modal('hide')
        $('#deleteModal').modal('show')
    }
    else{
        $('#deleteModal').modal('hide')
        $('#noVoteModal').modal('show')

    }
}


function deleteVoteUser(){
    // if (isVoted !== false){
    const req = {
        method: 'delete',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': myToken
        })
    };

    fetch('https://192.168.75.56/api/v3/election/ballots/'+ballotId, req)
        .then(response=> {
            if(response.status === 204){
                isVoted = false;
                var template = $('#template_vote').html();
                var html = Mustache.render(template, '');
                $('#myPanelVote').html(html);
                alert('Nice, your vote has been deleted successfully !', 'success')

                var myContent =  document.getElementById("affVote");
                myContent.innerHTML = "You have not yet voted.";
            }
            else if(response.status === 401 ){
                alert("You must log in !","warning");
            }
            else if(response.status === 403){
                alert("User not administrator or not owner of the vote", "warning");
            }
            else if(response.status === 404){
                alert("Vote not found", "warning");
            }
        })
        .catch(function(error) {
            alert("Il y a eu un problème avec l'opération fetch: " + error.message, "danger");
        });
}