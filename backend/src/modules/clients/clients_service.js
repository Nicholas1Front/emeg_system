const clientsRepository = require('./clients_repository');

class ClientsService{
    async createClient(data){
        const existingClient = await clientsRepository.findClients({document : data.document});

        if(existingClient.length > 0){
            throw new Error("A client with the same document already exists");
        }

        const allowedTypes = ['PF', 'PJ'];

        if(!allowedTypes.includes(data.type)){
            throw new Error("Invalid client type");
        }

        if(data.type === 'PF' && data.document.length > 11){
            throw new Error("Invalid document for PF type");
        }

        if(data.type === 'PJ' && data.document.length > 14){
            throw new Error("Invalid document for PJ type");
        }

        const client = await clientsRepository.createClient({
            name : data.name,
            address : data.address,
            document : data.document,
            type : data.type
        })

        return client;
    }

    async createClientContact(data){
        const existingClient = await clientsRepository.findClients({id : data.client_id});

        if(existingClient.length === 0){
            throw new Error("Client not found");
        }

        const contact = await clientsRepository.createContact({
            client_id : data.client_id,
            name : data.name,
            email : data.email,
            phone : data.phone
        });

        return contact
    }

    async findClients(filters){
        const clients = await clientsRepository.findClients(filters);

        return clients;
    }

    async findContacts(filters){
        const contacts = await clientsRepository.findContacts(filters);

        return contacts;
    }

    async updateClient({
        requesterRole,
        targetClientId,
        clientData
    }){
        if(requesterRole !== 'admin'){
            throw new Error('Only admins can update clients');
        }

        const existingClient = await clientsRepository.findClients({id : targetClientId});

        if(existingClient.length === 0){
            throw new Error('Client not found');
        }

        const allowedTypes = ['PF', 'PJ'];

        if(!allowedTypes.includes(data.type)){
            throw new Error("Invalid client type");
        }

        if(data.type === 'PF' && data.document.length > 11){
            throw new Error("Invalid document for PF type");
        }

        if(data.type === 'PJ' && data.document.length > 14){
            throw new Error("Invalid document for PJ type");
        }

        const updatedClient = await clientsRepository.updateClient({
            id : targetClientId,
            data : clientData
        });

        return updatedClient;
    }

    async updateContact({
        targetContactId,
        contactData
    }){
        const existingContact = await clientsRepository.findContacts({id : targetContactId});

        if(existingContact.length === 0){
            throw new Error('Contact not found');
        }

        const updatedContact = await clientsRepository.updateContact({
            id : targetContactId,
            data : contactData
        });

        return updatedContact;
    }

    async deleteClient({
        requesterRole,
        targetClientId
    }){
        if(requesterRole !== 'admin'){
            throw new Error('Only admins can delete clients');
        }

        const existingClient = await clientsRepository.findClients({id : targetClientId});

        if(existingClient.length === 0){
            throw new Error('Client not found');
        }

        await clientsRepository.deleteClient(targetClientId);

        return true;

    }

    async deleteContact(
        targetContactId
    ){
        const existingContact = await clientsRepository.findContacts({id : targetContactId});

        if(existingContact.length === 0){
            throw new Error('Contact not found');
        }

        await clientsRepository.deleteContact(targetContactId);

        return true;
    }
}

module.exports = new ClientsService();