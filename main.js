$(document).ready(function () {
    updateTable()

    $("#enregistrerClient").click(function () {

        $(".mod").addClass("active");
    });


    $("#modClose, #annuler").click(function () {
        closeMod();
    });

    $('#annuler')
        .click(function () { closeMod() });

    $("#editer").click(function () {
        if (isValidFields()) {
            let mod = $(".mod");
            let client = {
                nom: mod.find('#nom').val(),
                prenom: mod.find('#prenom').val(),
                email: mod.find('#email').val(),
                telephone: mod.find('#telephone').val()
            }
            let index = mod.find("#nom").attr("data-index")
            if (index === 'new') {
                createClient(client);
                updateTable();
                closeMod();
            } else {
                updateClient(index, client);
                updateTable();
                closeMod();
            }
        }
    });

});

function closeMod() {
    clearFields();
    $(".mod").removeClass("active");
}

function clearFields() {
    $(".mod-field").val("");
    $('#nom').attr('data-index', 'new');
}

function isValidFields() {
    return $('#form').get(0).reportValidity();
}



function getLocalStorage() {
    return JSON.parse(localStorage.getItem('db_client')) ?? [];
}

function setLocalStorage(dbClient) {
    localStorage.setItem("db_client", JSON.stringify(dbClient));
} 



function deleteClient(index) {
    let dbClient = getLocalStorage();
    dbClient.splice(index, 1);
    setLocalStorage(dbClient);
}

function updateClient(index, client) {
    let dbClient = getLocalStorage();
    dbClient[index] = client;
    setLocalStorage(dbClient);
}

function createClient(client) {
     $.ajax({
            mode: 'no-cors',
            type: "POST",
            crossDomain: true, 
            url: "http://127.0.0.1:8080/user",
            dataType: 'jsonp',
            data: client,
            error: function() {
                alert("impossible de créer les données utilisateur")
            },

            success: function (data) {
            console.log(data);
        }
        })
}

function clearTable() {
    let rows = $("#tableClient>tbody tr");
    $(rows).remove()
}

function updateTable() {
     $.ajax({
            mode: 'no-cors',
            type: "GET",
            crossDomain: true, 
            url: "http://127.0.0.1:8080/users",
            dataType: 'jsonp',
            error: function() {
                alert("impossible de récupérer les données")
            },

            success: function (data) {
            console.log(data);
        }

        })

    let dbClient = getLocalStorage();
    clearTable();
    dbClient.forEach(createRow);
    $(".inlineButton").click(function (e) { editDelete(e) })
}

function fillFields(client) {
    let mod = $(".mod");
    mod.find('#nom').val(client.nom),
        mod.find('#prenom').val(client.prenom),
        mod.find('#email').val(client.email),
        mod.find('#telephone').val(client.telephone)
    mod.find('#nom').attr('data-index', client.index);
}

function editClient(index) {
    let client = getLocalStorage()[index]
    client.index = index
    fillFields(client)
    $(".mod").addClass("active");
}

function createRow(client, index) {
    $("#tableClient").last()
        .append(
            $('<tr>')
                .append($('<td>').text(client.nom))
                .append($('<td>').text(client.prenom))
                .append($('<td>').text(client.email))
                .append($('<td>').text(client.telephone))
                .append(
                    $('<td>')
                        .append("<button type=\"button\" class=\"button green inlineButton\" id=\"edit-" + index + "\">Éditer</button>")
                        .append("<button type=\"button\" class=\"button red inlineButton\" id=\"delete-" + index + "\">Effacer</button>")
                )
        )
}

function editDelete(e) {
    let [action, index] = $(e.target).attr('id').split('-')
    if (action === 'edit') {
        editClient(index)
    } else {
        let response = confirm(`Souhaitez-vous vraiment supprimer ce client ?`)
        if (response) {
            deleteClient(index)
            updateTable()
        }
    }
}
