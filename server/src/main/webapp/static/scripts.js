let myToken;
var userLogin;
let indexTemplate;
let ballotTemplate;

let nameCandidat;

let nbVote;
let ballotId;
let isVoted;


$(window).bind('load', () => {

    indexTemplate = $('#index').prop('innerHTML');
    ballotTemplate = $('#template_vote').prop('innerHTML');
    // monCompteTemplate = $('#monCompte').prop('innerHTML');
    routage(location.hash);
    if(!myToken) {
        location.hash = "index";
        $("#ifConnected" ).hide();
        $("#ifNotConnected" ).show();
        $('#errMsg').hide();
        $('#delete').hide();
    }
    else if(myToken) {
        $("#ifNotConnected" ).hide();
        $("#ifConnected" ).show();
        $('#delete').hide();
    }
});

$(window).bind('hashchange', () => {

    let url = location.hash.split("/")[0];
    if ( url === "#candidat"){
        routage(location.hash.split("/")[0]);
        return;
    }
    if(!myToken && location.hash === "index") {
        // location.hash = "index";
        // routage(location.hash);
        $("#connect").show();
        $("#vote").hide();
        $("#ballot").hide();
        $("#deco").hide();
        $("#candidats").hide();
        $('#delete').hide();
        return;
    }
    else {
        // $("#vote").show();
        // $("#ballot").show();
        // $("#deco").show();
        // $("#connect").hide();
        //$("#errMsg").html("");
        routage(location.hash);
    }

    // window.setTimeout(masquernotification, 31000);

});



function routage(route) {
    $("section").each( function() {
        $(this).hide();
    });
    $(route).show();
}



// pour les alerts






// Fetch pour afficher les resulats

fetch('https://192.168.75.56/api/v3/election/resultats')
    .then(resp => {
        console.log(resp);
        if(resp.ok){
            resp.json().then(data => {

                let listElection = {listElection : data};

                var template = $('#mp_template').html();
                var html = Mustache.render(template, listElection);
                $('#mypanel_election').html(html);

            })
        }
    });


async function loginFonction() {

//     method: 'POST',
//         mode: 'cors',
//         cache: 'no-cache',
//         credentials: 'same-origin',
//         headers: new Headers({
//         'Content-Type': 'application/json;  charset=utf-8'
//     }),
//         body: JSON.stringify({
//         login: $('#loginForm').val(),
//         nom: $('#nomForm').val(),
//         admin: "false"
//     })
// })

    isVoted = false;
    let request = {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            login: $('#loginForm').val(),
            nom: $('#nomForm').val(),
            admin: "false"
        })
    };

    await fetch('https://192.168.75.56/api/v3/users/login', request)
        .then(response => {
            let login;
            if (response.ok) {
                (() => {
                    'use strict';

                    // Fetch all the forms we want to apply custom Bootstrap validation styles to
                    const forms = document.querySelectorAll('.needs-validation');

                    // Loop over them and prevent submission
                    Array.prototype.slice.call(forms).forEach((form) => {
                        form.addEventListener('submit', (event) => {
                            if (!form.checkValidity()) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                            else{
                                login = $('#loginForm').val();
                                userLogin = login;
                                var toastTrigger = document.getElementById('liveToastBtn')
                                var toastLiveExample = document.getElementById('liveToast')
                                if (toastTrigger) {
                                    toastTrigger.addEventListener('click', function () {
                                        var toast = new bootstrap.Toast(toastLiveExample)

                                        toast.show()
                                    })
                                }
                                myToken = response.headers.get('Authorization').replace("Bearer ", "");

                                console.log(myToken);
                                $("#ifNotConnected").hide();
                                $("#ifConnected").show();
                                $("#connect").hide();

                                routage(location.hash = "index");
                                $("#index").show();
                                const myError = new Error("Vous êtes connecté")
                                displayError(myError, true);
                                // const request2 = {
                                //     method: 'get',
                                //     headers: new Headers({
                                //         'Accept': 'application/json',
                                //         'Authorization': myToken
                                //     })
                                // }


                            }
                            form.classList.add('was-validated');
                        }, false);
                    });
                })();


            } else {
                // const myError = new Error("Erreur Login")
                displayError(false);
            }
        });
    // userLogin = login;


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
                    // const user = {
                    //     login: data.login,
                    //     admin: data.admin,
                    //     nom: data.nom,
                    // };
                    location.hash = 'monCompte';
                    var infoUser = {infoUser: data};
                    var template = $('#compteList').html();
                    var html = Mustache.render(template, infoUser);
                    $('#myPanelCompte').html(html);
                })

            } else if(response.status === 401 || login === undefined){
                const myError = new Error("Connectez-vous !")
                displayError(myError,false);
            }

        });

}


// Modifie le nom de l'utilisateur quand le champ input change
async function editName(){
    const request = {
        method: 'put',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization':  myToken
        }),
        body: JSON.stringify({
            nom: newName,
        })
    };
    fetch("https://192.168.75.56/api/v3/users/"+ userLogin+"/nom", request)
        .then(response => {
            if(response.ok){
                const myError = new Error("Nom modifié avec success")
                displayError(myError,true);
            }
        });
}


//  Pour afficher les noms des candidats

fetch('https://192.168.75.56/api/v3/election/candidats/noms')
    .then(resp => {
            console.log(resp);
            if(resp.ok){
                resp.json().then(data => {

                    console.log("list"+data);
                    // let tabNomCandidats = [];
                    //
                    // // let arr = listcandidat[0].substring(0, 2);
                    // for (let i = 0; i < data.length; i++){
                    //     tabNomCandidats[i] = data[i].split('/')[2];
                    // }
                    //
                    // let listcandidat = {listcandidat: tabNomCandidats};
                    // console.log(data);
                    let listcandidat = {listcandidat : data};

                    var template = $('#template_cand').html();
                    var html = Mustache.render(template, listcandidat);
                    $('#mypanel_cand').html(html);

                    var template2 = $('#template_nom').html();
                    var html2 = Mustache.render(template2, listcandidat);
                    $('#mypanel_nom').html(html2);

                })
            }
        }
    )



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
        });


}




// La function de vote


// function voter(){
//     alert("kvskdjbhj");
//     console.log("entrée");
//     console.log(isVoted);
//
// }
//
//
//



// logout utilisateur
function logoutFunction() {
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
                let html = Mustache.render(indexTemplate," ");
                $('#'+location.hash.replace('#', '')).html(html);
                const myError = new Error("Vous êtes déconnecté !")
                displayError(myError, true);
            }
        });


}



function displayError(msg, bool) {
    if(bool){
        $("#errMsg").html(msg.message).css("color", "green");
        // $('#errMsg').show();
    } else {
        // $('#errMsg').hide();
        $("#errMsg").html(msg.message).css("color", "red");
    }
}




// Fonction pour ajouter un écouteur d'évènement à la table

let newName

document.addEventListener("DOMContentLoaded", function(event) {
    document.getElementById('newName').addEventListener("change",function() {
        console.log("input event fired");
        console.log("contenteditable element changed");
        $('#nameUser').text($(this).val());
        newName = $(this).val();
    }, false);
});



// function changeName(){
//
// }

// let input = document.getElementById("changeName");
//
// input.addEventListener('input', function (){
// $('#changeName').keyup(function() {
//     alert("ca marche")
//     $('#nom2').text($(this).val());
//     let input = $(this).val();
//     alert("ca marche");
//     const request = {
//         method: 'put',
//         headers: new Headers({
//             'Content-Type': 'application/json',
//             'Authorization':  myToken
//         }),
//         body: JSON.stringify({
//             nom: input.value(),
//         })
//     };
//     fetch("https://192.168.75.56/api/v3/users/"+ userLogin+"/nom", request)
//         .then(response => {
//             if(response.ok){
//                 const myError = new Error("Nom modifié avec success")
//                 displayError(myError,true);
//             }
//         });
// });

//  la fonction pour supprimer un vote
function deleteVoteUser(){
    if (isVoted !== false){
        const req = {
            method: 'delete',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': myToken
            })
        };

        fetch('https://192.168.75.56/api/v3/election/ballots/'+ballotId, req)
            .then(response=> {
                if(response.ok){
                    isVoted = false;
                    var template = $('#template_vote').html();
                    var html = Mustache.render(template, '');
                    $('#myPanelVote').html(html);
                }
            })
        // fetch('https://192.168.75.56/api/v3/election/ballots/byUser/'+userLogin, req)
        //     .then(resp => {
        //         if (resp.ok){
        //             resp.json().then(data => {
        //
        //                 console.log(data.id.split('/')[2]);
        //                 // var infoVote = {infoVote: data};
        //                 // var template = $('#template_vote').html();
        //                 // var html = Mustache.render(template, infoVote);
        //                 // $('#myPanelVote').html(html);
        //                 if (data.id.split('/')[2]){
        //                     var ballotID = data.id.split('/')[2];
        //                 }
        //                 const req2 = {
        //                     method: 'delete',
        //                     headers: new Headers({
        //                         'Content-Type': 'application/json',
        //                         'Authorization': myToken
        //                     })
        //                 };
        //
        //
        //             });
        //         }
        //         // else {
        //         //     alert("Sorry! you can't delete", "danger");
        //         // }
        //
        //     })
        //     .catch(function(error) {
        //         console.log('vous ne pouvez pas supprimer ' + error.message);
        //     });
    }



}


function mustacheFunction(template,data,elemId) {
    let html = Mustache.render(template,data);
    $('#'+elemId).html(html);
}