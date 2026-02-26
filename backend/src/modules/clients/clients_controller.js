const clientsService = require("./clients_service");
const {
    createClientSchema,
    createContactSchema,
    updateClientSchema,
    updateContactSchema,
    findClientSchema,
    findContactSchema
} = require("./clients_schema");

class ClientsController {
    async createClient(req, res){
        try{
            const validatedClient = createClientSchema.parse(req.body);

            const client = await clientsService.createClient(validatedClient);

            return res.status(201).json({
                message : "Client created successfully",
                data : client
            })
        }catch(err){
            res.status(400).json({
                message : "Failed to create client",
                error : {err}
            })
        }
    }
    async createContact(req, res){
        try{
            const validatedContact = createContactSchema.parse(req.body);

            const contact = await clientsService.createClientContact(validatedContact);

            return res.status(201).json({
                message : "Contact created successfully",
                data : contact
            })
        }catch(err){
            return res.status(400).json({
                message : "Failed to create contact",
                error : {err}
            })
        }
    }

    async updateClient(req, res){
        try{
            const validatedClient = updateClientSchema.parse(req.body);

            const client = await clientsService.updateClient({
                requesterRole : req.user.role,
                targetClientId : req.params.id,
                clientData : validatedClient
            })

            return res.status(200).json({
                message : "Client updated successfully",
                data : client
            });

        }catch(err){
            return res.status(400).json({
                message : "Failed to update client",
                error : {err}
            })
        }
    }

    async updateContact(req, res){
        try{
            const validatedContact = updateContactSchema.parse(req.body);

            const contact = await clientsService.updateContact({
                targetContactId : req.params.id,
                contactData : validatedContact
            });

            return res.status(201).json({
                message : "Contact updated successfully",
                data : contact
            });

        }catch(err){
            return res.status(400).json({
                message : "Failed to update contact",
                error : {err}
            })
        }
    }

    async deleteClient(req, res){
        try{

            await clientsService.deleteClient({
                requesterRole : req.user.role,
                targetClientId : req.params.id
            });

            return res.status(200).json({
                message : "Client deleted successfully"
            })

        }catch(err){
            return res.status(400).json({
                message : "Failed to delete client",
                error : {err}
            })
        }
    }

    async deleteContact(req, res){
        try{

            await clientsService.deleteContact({
                targetContactId : req.params.id
            });

            return res.status(200).json({
                message : "Contact deleted successfully"
            })

        }catch(err){
            return res.status(400).json({
                message : "Failed to delete contact",
                error : {err}
            })
        }
    }

    async findClients(req,res){
        try{
            const filters = findClientSchema.parse(req.query);

            const clients = await clientsService.findClients(filters);

            return res.status(201).json({
                message : "Clients found successfully",
                data : clients
            });
        }catch(err){
            return res.status(400).json({
                message : "Failed to find clients",
                error : {err}
            })
        }
    }

    async findContacts(req,res){
        try{
            const filters = findContactSchema.parse(req.query);

            const contacts = await clientsService.findContacts(filters);

            return res.status(201).json({
                message : "Contacts found successfully",
                data : contacts
            })
        }catch(err){
            return res.status(400).json({
                message : "Failed to find contacts",
                error : {err}
            })
        }
    }
}

module.exports = new ClientsController();