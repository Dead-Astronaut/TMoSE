import type { Certification } from '../types'
import { getLocalQuestions } from './questions'

export interface CertInfo {
  id: Certification
  name: string
  fullName: string
  description: string
  level: 'entry' | 'associate' | 'professional' | 'expert'
  code: string
  questionCount: number
  topics: string[]
}

export const LEVEL_LABEL: Record<string, string> = {
  entry: 'Entry',
  associate: 'Assoc.',
  professional: 'Prof.',
  expert: 'Expert',
}

function getQuestionCount(id: Certification): number {
  return getLocalQuestions().filter((q) => q.certification === id).length
}

const CERT_DATA: Omit<CertInfo, 'questionCount' | 'topics'>[] = [
  {
    id: 'PCEP',
    name: 'PCEP™',
    fullName: 'PCEP™ – Certified Entry-Level Python Programmer',
    description: 'Validate your foundational Python skills: basics, data types, control flow, functions, and simple I/O.',
    level: 'entry',
    code: 'PCEP-30-02',
  },
  {
    id: 'PCAP',
    name: 'PCAP™',
    fullName: 'PCAP™ – Certified Associate in Python Programming',
    description: 'Demonstrate intermediate Python: OOP, modules, file handling, and exception handling.',
    level: 'associate',
    code: 'PCAP-31-03',
  },
  {
    id: 'PCPP1',
    name: 'PCPP1™',
    fullName: 'PCPP1™ – Certified Professional in Python Programming 1',
    description: 'Show advanced Python: design patterns, GUI, network programming, and testing.',
    level: 'professional',
    code: 'PCPP-32-10x',
  },
  {
    id: 'PCEI',
    name: 'PCEI™',
    fullName: 'PCEI™ – Certified Entry-Level AI Specialist',
    description: 'Validate foundational AI knowledge: machine learning concepts, neural networks, AI tools, and responsible AI practices.',
    level: 'entry',
    code: 'PCEI',
  },
]

const TOPICS_BY_CERT: Record<Certification, string[]> = {
  PCEP: ['Computer programming', 'Data types & variables', 'Boolean logic', 'Control flow', 'Functions', 'Input & output'],
  PCAP: ['Modules & packages', 'OOP', 'File handling', 'Exception handling', 'Standard library'],
  PCPP1: ['Design patterns', 'GUI programming', 'Network programming', 'Testing', 'Database access'],
  PCEI: ['Architecture', 'Performance', 'Security', 'Deployment', 'Best practices'],
}

function buildCertInfo(cert: Omit<CertInfo, 'questionCount' | 'topics'>): CertInfo {
  return {
    ...cert,
    questionCount: getQuestionCount(cert.id),
    topics: TOPICS_BY_CERT[cert.id] ?? [],
  }
}

const CERTS: CertInfo[] = CERT_DATA.map(buildCertInfo)

export interface Track {
  id: string
  name: string
  color: string
  certs: CertInfo[]
}

export const TRACKS: Track[] = [
  {
    id: 'entry',
    name: 'Entry',
    color: '#34A853',
    certs: CERTS.filter((c) => c.level === 'entry'),
  },
  {
    id: 'associate',
    name: 'Associate',
    color: '#4285F4',
    certs: CERTS.filter((c) => c.level === 'associate'),
  },
  {
    id: 'professional',
    name: 'Professional',
    color: '#9C27B0',
    certs: CERTS.filter((c) => c.level === 'professional' || c.level === 'expert'),
  },
]

export function getCertById(id: string): CertInfo | undefined {
  return CERTS.find((c) => c.id === id)
}

export function getTrackForCert(certId: string): Track | undefined {
  return TRACKS.find((t) => t.certs.some((c) => c.id === certId))
}
