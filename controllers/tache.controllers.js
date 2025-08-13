const Task = require('../models/taches.models');

exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, assignedTo } = req.body;
    const task = await Task.create({
      title,
      description,
      priority,
      assignedTo,
      createdBy: req.user.id
    });
    res.status(201).json({task});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority } = req.query;
    const filters = {};
    if (status) filters.status = status;
    if (priority) filters.priority = priority;

    const tasks = await Task.find(filters)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('assignedTo', 'name')
      .populate('createdBy', 'name');

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getTask=async (req,res)=>{
    try {
    const {search = '',page = 1,limit = 5,sortBy = 'date',order = 'desc'} = req.body;

    const skip = (page - 1) * limit;
    const sortOrder = order === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };

    const filter = {
      $or: [
        { status: { $regex: search, $options: 'i' } },
        { priority: { $regex: search, $options: 'i' } }
      ]
    };
    let tasks, total;
    if(search==""){
        tasks = await Task.find()
       .sort(sort)
       .skip(skip)
       .limit(limit)
       .populate('assignedTo', 'name')
       .populate('createdBy', 'name');

       total = await Task.countDocuments();
 
    }else{
      tasks = await Task.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('assignedTo', 'name')
      .populate('createdBy', 'name');

     total = await Task.countDocuments(filter);

    }
       let detail
       if(total==0){
          detail={
           results: `Pas de correspondant pour ${search}`
          }
       }else{
            detail={
            page,
           limit,
           total,
           totalPages: Math.ceil(total / limit),
           results: tasks
          }
       }
    res.json({
      detail
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name')
      .populate('createdBy', 'name');
    if (!task) return res.status(404).json({ message: 'Tâche non trouvée.' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const updates = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate('assignedTo', 'name')
      .populate('createdBy', 'name');
    if (!task) return res.status(404).json({ message: 'Tâche non trouvée.' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tâche supprimée.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const updates = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Tâche non trouvée.' });

    // Vérifier si l'utilisateur est admin ou propriétaire (assignedTo)
    if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Vous n'avez pas la permission de modifier cette tâche." });
    }

    // Mettre à jour les champs autorisés (dont status)
    // Par exemple ici on autorise update de title, description, priority, status
    const allowedUpdates = ['title', 'description', 'priority', 'status'];
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        task[field] = updates[field];
      }
    });

    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
