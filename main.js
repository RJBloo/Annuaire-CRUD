

const openMod = () => document.getElementById('mod')
    .classList.add('active')

const closeMod = () => {
    clearFields()
    document.getElementById('mod').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient))


const deleteClient = (index) => {
    const dbClient = readClient()
    dbClient.splice(index, 1)
    setLocalStorage(dbClient)
}

const updateClient = (index, client) => {
    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)
}

const readClient = () => getLocalStorage()

const createClient = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push (client)
    setLocalStorage(dbClient)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}



const clearFields = () => {
    const fields = document.querySelectorAll('.mod-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nom').dataset.index = 'new'
}

const saveClient = () => {
    debugger
    if (isValidFields()) {
        const client = {
            nom: document.getElementById('nom').value,
            prenom: document.getElementById('prenom').value,
            email: document.getElementById('email').value,
            telephone: document.getElementById('telephone').value
            
        }
        const index = document.getElementById('nom').dataset.index
        if (index == 'new') {
            createClient(client)
            updateTable()
            closeMod()
        } else {
            updateClient(index, client)
            updateTable()
            closeMod()
        }
    }
}

const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${client.nom}</td>
        <td>${client.prenom}</td>
        <td>${client.email}</td>
        <td>${client.telephone}</td>        
        <td>
            <button type="button" class="button green" id="edit-${index}">Éditer</button>
            <button type="button" class="button red" id="delete-${index}" >Effacer</button>
        </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbClient = readClient()
    clearTable()
    dbClient.forEach(createRow)
}

const fillFields = (client) => {
    document.getElementById('nom').value = client.nom
    document.getElementById('prenom').value = client.prenom
    document.getElementById('email').value = client.email
    document.getElementById('telephone').value = client.telephone    
    document.getElementById('nom').dataset.index = client.index
}

const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFields(client)
    openMod()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editClient(index)
        } else {
            const client = readClient()[index]
            const response = confirm(`Souhaitez-vous vraiment supprimer ce client ?`)
            if (response) {
                deleteClient(index)
                updateTable()
            }
        }
    }
}

updateTable()


document.getElementById('enregistrerClient')
    .addEventListener('click', openMod)

document.getElementById('modClose')
    .addEventListener('click', closeMod)

document.getElementById('editer')
    .addEventListener('click', saveClient)

document.querySelector('#tableClient>tbody')
    .addEventListener('click', editDelete)

document.getElementById('annuler')
    .addEventListener('click', closeMod)