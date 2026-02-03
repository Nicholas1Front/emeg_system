const NotesRepository = require('./notes_repository');

class NotesService{
    async createNote({
        requesterId,
        title,
        content,
        date_reference
    }){

        if(!title || title.length === 0){
            title = 'Anotação diária';
        }

        date_reference = date_reference.toISOString().split('T')[0];

        title = `${title} - ${date_reference}`;

        const note = await NotesRepository.create({
            title,
            content,
            creator_id : requesterId,
            date_reference
        });

        return note;
    }

    async updateNote({
        requesterId,
        requesterRole,
        noteId,
        title,
        content,
        date_reference
    }){
        const note = await NotesRepository.find({
            id : noteId
        });

        if(!note || note.length === 0){
            throw new Error('Note not found');
        }

        note = note[0];

        if(requesterRole !== 'admin' && note.creator_id !== requesterId){
            throw new Error('Unauthorized access');
        }

        const updatedNote = await NotesRepository.update({
            id : noteId,
            title,
            content,
            date_reference
        });

        if(!updatedNote){
            throw new Error('Failed to update note');
        }

        return updatedNote;
    }

    async getNotes(filters){

        const notes = await NotesRepository.find({
            id : filters.id,
            creator_id : filters.creatorId,
            date_reference_start : filters.date_reference_start,
            date_reference_end : filters.date_reference_end
        });

        return notes;
    }

    async deleteNote({
        noteId,
        requesterRole
    }){
        if(requesterRole !== 'admin'){
            throw new Error('Unauthorized access');
        }

        await NotesRepository.delete({
            id : noteId
        });
    
        return {
            message : 'Note deleted successfully',
        }
    }
}

module.exports = new NotesService();