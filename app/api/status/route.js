import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { fileId } = req.query;

    if (!fileId) {
        return res.status(400).json({ error: 'Missing fileId parameter' });
    }

    try {
        // In a production app, you would check a database instead
        // This is a simplified example
        const statusFilePath = path.join(process.cwd(), 'uploads', `${fileId}.status.json`);

        if (!fs.existsSync(statusFilePath)) {
            return res.status(404).json({ error: 'Analysis not found' });
        }

        const statusData = JSON.parse(fs.readFileSync(statusFilePath, 'utf8'));
        return res.status(200).json(statusData);
    } catch (error) {
        console.error('Error checking status:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}
