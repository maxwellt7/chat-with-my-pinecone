export async function exportRoute(req, res) {
  try {
    const { format } = req.params;
    const { projectId, projectData } = req.body;

    if (!['pdf', 'docx', 'md'].includes(format)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid format. Supported formats: pdf, docx, md',
      });
    }

    // For now, return a simple markdown export
    // In production, you would use libraries like:
    // - pdf: puppeteer or pdfkit
    // - docx: docx library
    // - md: just format the data

    if (format === 'md') {
      const markdown = generateMarkdown(projectData);
      
      res.setHeader('Content-Type', 'text/markdown');
      res.setHeader('Content-Disposition', `attachment; filename="launch-document-${Date.now()}.md"`);
      res.send(markdown);
    } else {
      // For PDF and DOCX, we'll return a placeholder for now
      res.json({
        success: false,
        error: `${format.toUpperCase()} export is not yet implemented. Use MD format for now.`,
      });
    }
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

function generateMarkdown(projectData) {
  let markdown = `# Launch Document\n\n`;
  markdown += `Generated: ${new Date().toISOString()}\n\n`;
  markdown += `---\n\n`;

  if (projectData?.launchDoc?.sections) {
    projectData.launchDoc.sections.forEach(section => {
      markdown += `## ${section.title}\n\n`;
      markdown += `${section.content}\n\n`;
      markdown += `---\n\n`;
    });
  }

  return markdown;
}

