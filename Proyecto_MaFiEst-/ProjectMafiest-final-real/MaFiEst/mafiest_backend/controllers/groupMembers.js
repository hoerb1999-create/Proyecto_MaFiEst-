const { Group, User } = require('../models');

exports.getGroupMembers = async (req, res) => {
    try {
        const group = await Group.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'estudiantes',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: User,
                    as: 'docentes',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        if (!group) {
            return res.status(404).json({ message: 'Grupo no encontrado' });
        }

        res.json({
            estudiantes: group.estudiantes,
            docentes: group.docentes
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addMember = async (req, res) => {
    try {
        const { groupId, userId, role } = req.body;
        const group = await Group.findByPk(groupId);
        const user = await User.findByPk(userId);

        if (!group || !user) {
            return res.status(404).json({ message: 'Grupo o usuario no encontrado' });
        }

        if (role === 'estudiante') {
            await group.addEstudiante(user);
        } else if (role === 'docente') {
            await group.addDocente(user);
        }

        res.json({ message: 'Miembro añadido exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeMember = async (req, res) => {
    try {
        const { groupId, userId, role } = req.body;
        const group = await Group.findByPk(groupId);
        const user = await User.findByPk(userId);

        if (!group || !user) {
            return res.status(404).json({ message: 'Grupo o usuario no encontrado' });
        }

        if (role === 'estudiante') {
            await group.removeEstudiante(user);
        } else if (role === 'docente') {
            await group.removeDocente(user);
        }

        res.json({ message: 'Miembro removido exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};