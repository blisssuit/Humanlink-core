import { AIProvider, DiagnosisResult } from '../types'

/**
 * Mock AI Provider for development and testing
 * Returns realistic but synthetic diagnosis data
 */

const MOCK_DISEASES = [
  {
    disease: 'Maize Leaf Blight',
    confidence: 87,
    severity: 'medium',
    symptoms: ['Brown lesions on leaves', 'Yellowing of leaf edges', 'Fungal spores visible'],
    aiExplanation:
      'The image shows characteristic brown, elongated lesions on the maize leaves with a distinct halo pattern. These are typical signs of Northern Leaf Blight caused by Exserohilum turcicum. The spore production and lesion distribution suggest active disease progression.',
    treatment:
      'Apply fungicide spray containing azoxystrobin or propiconazole. Spray every 7-10 days. Remove infected leaves and improve air circulation. Consider crop rotation next season.',
    preventiveMeasures: [
      'Use disease-resistant maize varieties',
      'Maintain proper plant spacing for air circulation',
      'Avoid overhead irrigation',
      'Practice crop rotation',
      'Remove crop residue immediately after harvest',
    ],
    recoveryEstimate: 14,
  },
  {
    disease: 'Cassava Brown Streak',
    confidence: 92,
    severity: 'high',
    symptoms: ['Brown streaks on stems', 'Yellowing leaves', 'Root necrosis'],
    aiExplanation:
      'The detected symptoms are consistent with Cassava Brown Streak Virus (CBSV). The brown discoloration on stems and the systemic yellowing of leaves are hallmark signs. This is a serious disease that requires immediate intervention to prevent crop loss.',
    treatment:
      'Remove infected plants immediately to prevent spread. Plant virus-free cuttings. Use resistant varieties. Control whitefly vectors with insecticides or neem oil sprays.',
    preventiveMeasures: [
      'Use certified virus-free planting materials',
      'Control whitefly populations',
      'Avoid planting near infected fields',
      'Inspect plants regularly for early symptoms',
      'Remove alternate hosts',
    ],
    recoveryEstimate: 30,
  },
  {
    disease: 'Tomato Early Blight',
    confidence: 78,
    severity: 'low',
    symptoms: ['Circular brown spots', 'Yellow halo around lesions', 'Spore formation'],
    aiExplanation:
      'The tomato leaves show concentric ring patterns typical of Early Blight (Alternaria solani). While this disease is generally manageable, early treatment prevents severe defoliation and fruit infection.',
    treatment:
      'Spray fungicide containing chlorothalonil or mancozeb. Remove lower infected leaves. Improve air circulation. Water at soil level to keep foliage dry.',
    preventiveMeasures: [
      'Mulch soil to prevent spore splash',
      'Stake and prune for better air circulation',
      'Avoid overhead watering',
      'Remove infected leaves promptly',
      'Rotate crops yearly',
    ],
    recoveryEstimate: 10,
  },
  {
    disease: 'Healthy Crop',
    confidence: 95,
    severity: 'low',
    symptoms: [],
    aiExplanation:
      'The analyzed crop shows no visible signs of disease. The leaves are green, with normal texture and coloration. The plant appears to be in good health with no detectable fungal or viral symptoms.',
    treatment: 'No treatment required. Continue regular monitoring and maintenance.',
    preventiveMeasures: [
      'Maintain proper watering schedule',
      'Apply balanced fertilizer',
      'Regular pest monitoring',
      'Continue disease prevention practices',
    ],
    recoveryEstimate: 0,
  },
  {
    disease: 'Rice Leaf Blast',
    confidence: 85,
    severity: 'high',
    symptoms: ['Diamond-shaped gray lesions', 'White spore formation', 'Leaf tissue death'],
    aiExplanation:
      'The rice leaves display classic symptoms of Blast disease (Pyricularia oryzae). The diamond-shaped lesions with gray centers are diagnostic. This fungal disease can cause severe yield losses if left untreated.',
    treatment:
      'Apply triazole fungicides like tebuconazole. Spray at 7-10 day intervals. Drain fields to reduce humidity. Apply balanced NPK fertilizer to strengthen plants.',
    preventiveMeasures: [
      'Use blast-resistant rice varieties',
      'Avoid excess nitrogen fertilization',
      'Maintain proper water management',
      'Remove infected plant debris',
      'Space plants adequately for airflow',
    ],
    recoveryEstimate: 21,
  },
]

export class MockAIProvider implements AIProvider {
  getName(): string {
    return 'Mock Provider (Development)'
  }

  isConfigured(): boolean {
    return true // Always available
  }

  async analyzeCropImage(imageUrl: string): Promise<DiagnosisResult> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000))

    // Select random diagnosis for demo
    const diagnosis = MOCK_DISEASES[Math.floor(Math.random() * MOCK_DISEASES.length)]

    return {
      disease: diagnosis.disease,
      confidence: diagnosis.confidence,
      severity: diagnosis.severity as 'low' | 'medium' | 'high',
      symptoms: diagnosis.symptoms,
      aiExplanation: diagnosis.aiExplanation,
      treatment: diagnosis.treatment,
      preventiveMeasures: diagnosis.preventiveMeasures,
      recoveryEstimate: diagnosis.recoveryEstimate,
      disclaimer:
        'This is a mock diagnosis for development purposes. For actual crop disease diagnosis, please consult with an agricultural expert. This AI analysis is not a substitute for professional diagnosis.',
    }
  }
}

export default new MockAIProvider()
