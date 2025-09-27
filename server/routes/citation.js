/**
 * Citation Routes - Core API endpoints for legal citation processing
 * 
 * Handles all citation formatting requests with comprehensive
 * Bluebook and Greenbook compliance.
 */

const express = require('express');
// const Joi = require('joi'); // Temporarily disabled for Railway deployment
const CitationEngine = require('../services/CitationEngine');
const AuthorityResolver = require('../services/AuthorityResolver');
const TypographyRenderer = require('../services/TypographyRenderer');
const logger = require('../utils/logger');

const router = express.Router();
const citationEngine = new CitationEngine();
const authorityResolver = new AuthorityResolver();
const typographyRenderer = new TypographyRenderer();

// Input validation schema - temporarily disabled for Railway deployment
// const formatSchema = Joi.object({
//   text: Joi.string().required().max(50000),
//   jurisdiction: Joi.string().default('federal').valid(
//     'federal', 'alabama', 'alaska', 'arizona', 'arkansas', 'california',
//     'colorado', 'connecticut', 'delaware', 'florida', 'georgia', 'hawaii',
//     'idaho', 'illinois', 'indiana', 'iowa', 'kansas', 'kentucky',
//     'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan',
//     'minnesota', 'mississippi', 'missouri', 'montana', 'nebraska',
//     'nevada', 'new-hampshire', 'new-jersey', 'new-mexico', 'new-york',
//     'north-carolina', 'north-dakota', 'ohio', 'oklahoma', 'oregon',
//     'pennsylvania', 'rhode-island', 'south-carolina', 'south-dakota',
//     'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington',
//     'west-virginia', 'wisconsin', 'wyoming', 'dc'
//   ),
//   style: Joi.string().default('bluepages').valid('bluepages', 'whitepages'),
//   includeShortcites: Joi.boolean().default(true),
//   outputFormat: Joi.string().default('html').valid('html', 'text', 'json'),
//   verifyAuthorities: Joi.boolean().default(true),
//   confidenceThreshold: Joi.number().min(0).max(1).default(0.7)
// });

/**
 * POST /api/citation/format
 * 
 * Primary endpoint for citation formatting
 */
router.post('/format', async (req, res) => {
  try {
    // Validate input - temporarily disabled for Railway deployment
    // const { error, value } = formatSchema.validate(req.body);
    // if (error) {
    //   return res.status(400).json({
    //     success: false,
    //     error: 'Validation Error',
    //     details: error.details.map(d => d.message),
    //     timestamp: new Date().toISOString()
    //   });
    // }

    // Basic validation without joi
    const { text, jurisdiction = 'federal', style = 'bluepages', includeShortcites = true, outputFormat = 'html', verifyAuthorities = true, confidenceThreshold = 0.7 } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: ['Text is required'],
        timestamp: new Date().toISOString()
      });
    }
    
    logger.info(`Citation request: ${text.length} chars, jurisdiction: ${jurisdiction}, style: ${style}`);

    // Step 1: Clean and segment the input text
    const cleanedText = citationEngine.cleanText(text);
    const segments = citationEngine.segmentText(cleanedText);
    
    // Step 2: Detect citation types and extract candidates
    const citations = [];
    const authoritiesConsidered = [];
    
    for (const segment of segments) {
      const citationType = citationEngine.detectCitationType(segment);
      const candidates = citationEngine.extractCandidates(segment, citationType);
      
      for (const candidate of candidates) {
        authoritiesConsidered.push({
          raw: candidate.raw,
          type: citationType,
          confidence: candidate.confidence
        });
        
        // Step 3: Resolve and verify authorities
        let resolvedAuthority = null;
        if (verifyAuthorities && candidate.confidence >= confidenceThreshold) {
          try {
            resolvedAuthority = await authorityResolver.resolve(candidate, jurisdiction);
          } catch (resolveError) {
            logger.warn(`Authority resolution failed: ${resolveError.message}`);
          }
        }
        
        // Step 4: Format according to jurisdiction rules
        const formattedCitation = citationEngine.formatCitation(
          candidate,
          resolvedAuthority,
          jurisdiction,
          style
        );
        
        citations.push({
          id: `cite_${citations.length + 1}`,
          type: citationType,
          raw: candidate.raw,
          formatted: formattedCitation,
          confidence: resolvedAuthority ? resolvedAuthority.confidence : candidate.confidence,
          verified: !!resolvedAuthority,
          authority: resolvedAuthority || null,
          shortcite: includeShortcites ? citationEngine.generateShortcite(formattedCitation, citations.length) : null
        });
      }
    }
    
    // Step 5: Apply typography and generate output
    let output;
    switch (outputFormat) {
      case 'html':
        output = typographyRenderer.renderHTML(citations, style);
        break;
      case 'text':
        output = typographyRenderer.renderText(citations);
        break;
      case 'json':
        output = citations;
        break;
      default:
        output = typographyRenderer.renderHTML(citations, style);
    }
    
    // Calculate overall confidence
    const overallConfidence = citations.length > 0 
      ? citations.reduce((sum, c) => sum + c.confidence, 0) / citations.length
      : 0;
    
    // Prepare response
    const response = {
      success: true,
      data: {
        citations: output,
        metadata: {
          jurisdiction,
          style,
          citationCount: citations.length,
          overallConfidence,
          verificationEnabled: verifyAuthorities,
          outputFormat,
          processingTime: new Date().toISOString()
        },
        diagnostics: {
          authoritiesConsidered: authoritiesConsidered.length,
          averageConfidence: overallConfidence,
          verifiedCount: citations.filter(c => c.verified).length,
          uncertainCount: citations.filter(c => c.confidence < confidenceThreshold).length
        }
      },
      timestamp: new Date().toISOString()
    };
    
    logger.info(`Citation processing complete: ${citations.length} citations, confidence: ${overallConfidence.toFixed(2)}`);
    res.json(response);
    
  } catch (error) {
    logger.error('Citation processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'An error occurred while processing your citation request.',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/citation/jurisdictions
 * 
 * Returns available jurisdictions and their configuration
 */
router.get('/jurisdictions', (req, res) => {
  try {
    const jurisdictions = citationEngine.getAvailableJurisdictions();
    res.json({
      success: true,
      data: jurisdictions,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Jurisdictions endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /api/citation/validate
 * 
 * Validates a citation without full formatting
 */
router.post('/validate', async (req, res) => {
  try {
    // Temporarily disabled joi validation for Railway deployment
    // const { error, value } = Joi.object({
    //   citation: Joi.string().required().max(1000),
    //   jurisdiction: Joi.string().default('federal')
    // }).validate(req.body);
    
    // Basic validation without joi
    const { citation, jurisdiction = 'federal' } = req.body;
    
    if (!citation) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: ['Citation is required']
      });
    }
    
    const validation = await citationEngine.validateCitation(value.citation, value.jurisdiction);
    
    res.json({
      success: true,
      data: validation,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('Citation validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;