const notesService = require('./notes_service');
const {
    createNoteSchema,
    updateNoteSchema,
    findNoteSchema
} = require('./notes_schema');

class NotesController{
    async createNote(req, res){
        try{
            const data = createNoteSchema.parse(req.body);

            const note = await notesService.createNote({
                requesterId : req.user.id,
                title : data.title,
                content : data.content,
                date_reference : data.date_reference
            })

            return res.status(200).json({
                message : 'Note created successfully',
                data : note
            })
        }
        catch(err){
            return res.status(400).json({
                message : 'Error creating note',
                error : err
            })
        }
    }
    async updateNote(req, res){
        try{
            const data = updateNoteSchema.parse(req.body);

            const note = await notesService.updateNote({
                requesterId : req.user.id,
                requesterRole : req.user.role,
                noteId : req.params.id,
                title : data.title,
                content : data.content,
                date_reference : data.date_reference
            });

            return res.status(200).json({
                message : 'Note updated successfully',
                data : note
            })
        }
        catch(err){
            return res.status(400).json({
                message : 'Error updating note',
                error : err
            })
        }
    }

    async getNotes(req, res){
        try{

            const filters = findNoteSchema.parse(req.query);

            const notes = await notesService.getNotes(filters)

            return res.status(200).json({
                message : 'Notes fetched successfully',
                data : notes
            })
        }
        catch(err){
            return res.status(400).json({
                message : 'Error fetching notes',
                error : err
            })
        }
    }

    async deleteNote(req, res){
        try{
            const noteId = req.params.id;
            const requesterRole = req.user.role;

            await notesService.deleteNote({
                noteId,
                requesterRole
            });

            return res.status(200).json({
                message : 'Note deleted successfully'
            })
        }catch(err){
            return res.status(400).json({
                message : 'Error deleting note',
                error : err
            })
        }
    }
}

module.exports = new NotesController();