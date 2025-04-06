import path from 'path';
import fs from 'fs';
import { processFile } from '../../lib/fileProcessor';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { fileId, password } = req.body;

    if (!fileId || !password) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        const filePath = path.join(process.cwd(), 'uploads', fileId);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Get file extension
        const fileType = path.extname(filePath).toLowerCase();

        // Create a status file to indicate processing has started
        const statusFilePath = path.join(process.cwd(), 'uploads', `${fileId}.status.json`);
        fs.writeFileSync(statusFilePath, JSON.stringify({ status: 'processing', fileId }));

        // Process the file asynchronously
        processFile(filePath, fileType, password)
            .then(result => {
                // Update status file with results
                fs.writeFileSync(statusFilePath, JSON.stringify({
                    status: 'complete',
                    fileId,
                    analysis: result.analysis
                }));
            })
            .catch(error => {
                console.error('Error processing file:', error);
                fs.writeFileSync(statusFilePath, JSON.stringify({
                    status: 'error',
                    fileId,
                    error: error.message
                }));
            });

        // Return immediately to client
        return res.status(200).json({ status: 'processing', fileId });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}
