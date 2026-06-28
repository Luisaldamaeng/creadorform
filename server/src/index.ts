import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// GET /api/projects - List all projects
app.get('/api/projects', async (_req, res) => {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: 'desc' },
    select: { id: true, name: true, updatedAt: true },
  });
  res.json(projects);
});

// GET /api/projects/:id - Load a project
app.get('/api/projects/:id', async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { id: req.params.id },
  });
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  res.json(project);
});

// POST /api/projects - Create a new project
app.post('/api/projects', async (req, res) => {
  const { name, elements } = req.body;
  const project = await prisma.project.create({
    data: {
      name: name || 'Sin título',
      elements: elements || [],
    },
  });
  res.status(201).json(project);
});

// PUT /api/projects/:id - Save/update a project
app.put('/api/projects/:id', async (req, res) => {
  const { name, elements } = req.body;
  const project = await prisma.project.update({
    where: { id: req.params.id },
    data: {
      ...(name !== undefined && { name }),
      ...(elements !== undefined && { elements }),
    },
  });
  res.json(project);
});

// DELETE /api/projects/:id
app.delete('/api/projects/:id', async (req, res) => {
  await prisma.project.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
