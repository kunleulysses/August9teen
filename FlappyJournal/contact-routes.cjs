// Contact Form Handler for Featherweight
const express = require('express');
const fs = require('fs/promises');
const path = require('path');

const router = express.Router();

// Contact form submission endpoint
router.post('/contact', async (req, res) => {
    try {
        const { name, email, message, investor, researcher } = req.body;
        
        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({ 
                error: 'Missing required fields: name, email, and message are required' 
            });
        }
        
        // Create contact submission object
        const contactSubmission = {
            timestamp: new Date().toISOString(),
            name: name.trim(),
            email: email.trim(),
            message: message.trim(),
            isInvestor: Boolean(investor),
            isResearcher: Boolean(researcher),
            submissionId: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent') || 'Unknown'
        };
        
        // Save to contact submissions file
        const contactsDir = '/opt/app/data/contacts';
        const contactsFile = path.join(contactsDir, 'submissions.json');
        
        // Ensure directory exists
        try {
            await fs.mkdir(contactsDir, { recursive: true });
        } catch (err) {
            console.log('Contacts directory already exists or created successfully');
        }
        
        // Read existing submissions or create new array
        let existingSubmissions = [];
        try {
            const existingData = await fs.readFile(contactsFile, 'utf8');
            existingSubmissions = JSON.parse(existingData);
        } catch (err) {
            console.log('Creating new contact submissions file');
            existingSubmissions = [];
        }
        
        // Add new submission
        existingSubmissions.push(contactSubmission);
        
        // Write back to file
        await fs.writeFile(contactsFile, JSON.stringify(existingSubmissions, null, 2));
        
        // Log submission for immediate notification
        console.log('\n🌟 NEW CONTACT FORM SUBMISSION 🌟');
        console.log('═'.repeat(50));
        console.log(`📅 Time: ${contactSubmission.timestamp}`);
        console.log(`👤 Name: ${contactSubmission.name}`);
        console.log(`📧 Email: ${contactSubmission.email}`);
        console.log(`💰 Investor: ${contactSubmission.isInvestor ? '✅ YES' : '❌ No'}`);
        console.log(`🔬 Researcher: ${contactSubmission.isResearcher ? '✅ YES' : '❌ No'}`);
        console.log(`💬 Message:`);
        console.log(contactSubmission.message);
        console.log('═'.repeat(50));
        console.log(`📝 Submission ID: ${contactSubmission.submissionId}`);
        console.log(`🌐 IP: ${contactSubmission.ip}`);
        console.log('\n');
        
        // Also save individual submission file for easy access
        const individualFile = path.join(contactsDir, `${contactSubmission.submissionId}.json`);
        await fs.writeFile(individualFile, JSON.stringify(contactSubmission, null, 2));
        
        // Return success response
        res.status(200).json({
            success: true,
            message: 'Thank you for your message! We will get back to you soon.',
            submissionId: contactSubmission.submissionId
        });
        
    } catch (error) {
        console.error('Error processing contact form submission:', error);
        res.status(500).json({
            error: 'Internal server error. Please try again later.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get all contact submissions (admin endpoint)
router.get('/contact/submissions', async (req, res) => {
    try {
        const contactsFile = '/opt/app/data/contacts/submissions.json';
        
        try {
            const data = await fs.readFile(contactsFile, 'utf8');
            const submissions = JSON.parse(data);
            
            // Sort by timestamp (newest first)
            submissions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            res.status(200).json({
                success: true,
                count: submissions.length,
                submissions: submissions
            });
        } catch (err) {
            res.status(200).json({
                success: true,
                count: 0,
                submissions: [],
                message: 'No submissions found'
            });
        }
    } catch (error) {
        console.error('Error retrieving contact submissions:', error);
        res.status(500).json({
            error: 'Error retrieving submissions',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Get contact submission statistics
router.get('/contact/stats', async (req, res) => {
    try {
        const contactsFile = '/opt/app/data/contacts/submissions.json';
        
        try {
            const data = await fs.readFile(contactsFile, 'utf8');
            const submissions = JSON.parse(data);
            
            const stats = {
                total: submissions.length,
                investors: submissions.filter(s => s.isInvestor).length,
                researchers: submissions.filter(s => s.isResearcher).length,
                recent24h: submissions.filter(s => 
                    new Date(s.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
                ).length,
                recent7days: submissions.filter(s => 
                    new Date(s.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).length
            };
            
            res.status(200).json({
                success: true,
                stats: stats
            });
        } catch (err) {
            res.status(200).json({
                success: true,
                stats: {
                    total: 0,
                    investors: 0,
                    researchers: 0,
                    recent24h: 0,
                    recent7days: 0
                }
            });
        }
    } catch (error) {
        console.error('Error retrieving contact stats:', error);
        res.status(500).json({
            error: 'Error retrieving stats'
        });
    }
});

module.exports = router;
