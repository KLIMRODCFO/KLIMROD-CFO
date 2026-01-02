'use client'

import AuthenticatedLayout from '@/app/components/AuthenticatedLayout'
import { useState } from 'react'

interface ApplicationForm {
  // Personal Information
  firstName: string
  middleName: string
  lastName: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
  email: string
  ssn: string
  dob: string
  
  // Position & Availability
  positionApplied: string
  availableStartDate: string
  desiredSalary: string
  employmentType: string // full-time, part-time
  
  // Education
  highSchool: string
  highSchoolGraduated: string
  college: string
  collegeDegree: string
  otherEducation: string
  
  // Employment History (3 previous employers)
  employer1Name: string
  employer1Phone: string
  employer1Position: string
  employer1From: string
  employer1To: string
  employer1Supervisor: string
  employer1Reason: string
  
  employer2Name: string
  employer2Phone: string
  employer2Position: string
  employer2From: string
  employer2To: string
  employer2Supervisor: string
  employer2Reason: string
  
  employer3Name: string
  employer3Phone: string
  employer3Position: string
  employer3From: string
  employer3To: string
  employer3Supervisor: string
  employer3Reason: string
  
  // References
  ref1Name: string
  ref1Phone: string
  ref1Relationship: string
  
  ref2Name: string
  ref2Phone: string
  ref2Relationship: string
  
  ref3Name: string
  ref3Phone: string
  ref3Relationship: string
  
  // Legal
  legallyAuthorized: string // yes/no
  convicted: string // yes/no
  convictedDetails: string
  
  // Signature
  signature: string
  signatureDate: string
}

export default function ApplicationPage() {
  const [form, setForm] = useState<ApplicationForm>({
    firstName: '', middleName: '', lastName: '', address: '', city: '', state: '', zip: '',
    phone: '', email: '', ssn: '', dob: '',
    positionApplied: '', availableStartDate: '', desiredSalary: '', employmentType: 'full-time',
    highSchool: '', highSchoolGraduated: '', college: '', collegeDegree: '', otherEducation: '',
    employer1Name: '', employer1Phone: '', employer1Position: '', employer1From: '', employer1To: '', employer1Supervisor: '', employer1Reason: '',
    employer2Name: '', employer2Phone: '', employer2Position: '', employer2From: '', employer2To: '', employer2Supervisor: '', employer2Reason: '',
    employer3Name: '', employer3Phone: '', employer3Position: '', employer3From: '', employer3To: '', employer3Supervisor: '', employer3Reason: '',
    ref1Name: '', ref1Phone: '', ref1Relationship: '',
    ref2Name: '', ref2Phone: '', ref2Relationship: '',
    ref3Name: '', ref3Phone: '', ref3Relationship: '',
    legallyAuthorized: 'yes', convicted: 'no', convictedDetails: '',
    signature: '', signatureDate: new Date().toISOString().split('T')[0]
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Save to localStorage for now
    const applications = JSON.parse(localStorage.getItem('hr_applications') || '[]')
    applications.push({ ...form, id: Date.now().toString(), submittedAt: new Date().toISOString() })
    localStorage.setItem('hr_applications', JSON.stringify(applications))
    alert('Application submitted successfully!')
    // Reset form or redirect
  }

  return (
    <AuthenticatedLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-2">APPLICATION FOR EMPLOYMENT</h1>
        <p className="text-gray-600 mb-6">Please complete all fields accurately</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white border-2 border-black rounded p-6">
            <h2 className="text-xl font-bold mb-4 border-b-2 border-black pb-2">PERSONAL INFORMATION</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">First Name *</label>
                <input name="firstName" value={form.firstName} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Middle Name</label>
                <input name="middleName" value={form.middleName} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Last Name *</label>
                <input name="lastName" value={form.lastName} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Address *</label>
                <input name="address" value={form.address} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-semibold mb-1">City *</label>
                <input name="city" value={form.city} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">State *</label>
                <input name="state" value={form.state} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">ZIP Code *</label>
                <input name="zip" value={form.zip} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Phone *</label>
                <input name="phone" type="tel" value={form.phone} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Email *</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Date of Birth *</label>
                <input name="dob" type="date" value={form.dob} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Social Security Number *</label>
                <input name="ssn" type="text" placeholder="XXX-XX-XXXX" value={form.ssn} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
              </div>
            </div>
          </div>

          {/* Position Applied */}
          <div className="bg-white border-2 border-black rounded p-6">
            <h2 className="text-xl font-bold mb-4 border-b-2 border-black pb-2">POSITION & AVAILABILITY</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Position Applied For *</label>
                <input name="positionApplied" value={form.positionApplied} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Available Start Date *</label>
                <input name="availableStartDate" type="date" value={form.availableStartDate} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Desired Salary</label>
                <input name="desiredSalary" value={form.desiredSalary} onChange={handleChange} className="w-full border px-3 py-2 rounded" placeholder="$XX.XX/hour" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Employment Type *</label>
                <select name="employmentType" value={form.employmentType} onChange={handleChange} required className="w-full border px-3 py-2 rounded">
                  <option value="full-time">Full-Time</option>
                  <option value="part-time">Part-Time</option>
                </select>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="bg-white border-2 border-black rounded p-6">
            <h2 className="text-xl font-bold mb-4 border-b-2 border-black pb-2">EDUCATION</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">High School</label>
                <input name="highSchool" value={form.highSchool} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Graduated?</label>
                <select name="highSchoolGraduated" value={form.highSchoolGraduated} onChange={handleChange} className="w-full border px-3 py-2 rounded">
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-semibold mb-1">College/University</label>
                <input name="college" value={form.college} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Degree/Major</label>
                <input name="collegeDegree" value={form.collegeDegree} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold mb-1">Other Education/Training</label>
              <textarea name="otherEducation" value={form.otherEducation} onChange={handleChange} rows={2} className="w-full border px-3 py-2 rounded" />
            </div>
          </div>

          {/* Employment History */}
          <div className="bg-white border-2 border-black rounded p-6">
            <h2 className="text-xl font-bold mb-4 border-b-2 border-black pb-2">EMPLOYMENT HISTORY (Most Recent First)</h2>
            
            {/* Employer 1 */}
            <div className="mb-6 pb-6 border-b">
              <h3 className="font-semibold mb-3">Previous Employer #1</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Company Name</label>
                  <input name="employer1Name" value={form.employer1Name} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Phone</label>
                  <input name="employer1Phone" value={form.employer1Phone} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Position</label>
                  <input name="employer1Position" value={form.employer1Position} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">From</label>
                  <input name="employer1From" type="date" value={form.employer1From} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">To</label>
                  <input name="employer1To" type="date" value={form.employer1To} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Supervisor</label>
                  <input name="employer1Supervisor" value={form.employer1Supervisor} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Reason for Leaving</label>
                  <input name="employer1Reason" value={form.employer1Reason} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                </div>
              </div>
            </div>

            {/* Employer 2 */}
            <div className="mb-6 pb-6 border-b">
              <h3 className="font-semibold mb-3">Previous Employer #2</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Company Name</label>
                  <input name="employer2Name" value={form.employer2Name} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Phone</label>
                  <input name="employer2Phone" value={form.employer2Phone} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Position</label>
                  <input name="employer2Position" value={form.employer2Position} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">From</label>
                  <input name="employer2From" type="date" value={form.employer2From} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">To</label>
                  <input name="employer2To" type="date" value={form.employer2To} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Supervisor</label>
                  <input name="employer2Supervisor" value={form.employer2Supervisor} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Reason for Leaving</label>
                  <input name="employer2Reason" value={form.employer2Reason} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                </div>
              </div>
            </div>

            {/* Employer 3 */}
            <div>
              <h3 className="font-semibold mb-3">Previous Employer #3</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Company Name</label>
                  <input name="employer3Name" value={form.employer3Name} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Phone</label>
                  <input name="employer3Phone" value={form.employer3Phone} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Position</label>
                  <input name="employer3Position" value={form.employer3Position} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">From</label>
                  <input name="employer3From" type="date" value={form.employer3From} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">To</label>
                  <input name="employer3To" type="date" value={form.employer3To} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Supervisor</label>
                  <input name="employer3Supervisor" value={form.employer3Supervisor} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Reason for Leaving</label>
                  <input name="employer3Reason" value={form.employer3Reason} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* References */}
          <div className="bg-white border-2 border-black rounded p-6">
            <h2 className="text-xl font-bold mb-4 border-b-2 border-black pb-2">REFERENCES (Non-relatives)</h2>
            {[1, 2, 3].map(num => (
              <div key={num} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Name</label>
                  <input name={`ref${num}Name`} value={form[`ref${num}Name` as keyof ApplicationForm] as string} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Phone</label>
                  <input name={`ref${num}Phone`} value={form[`ref${num}Phone` as keyof ApplicationForm] as string} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Relationship</label>
                  <input name={`ref${num}Relationship`} value={form[`ref${num}Relationship` as keyof ApplicationForm] as string} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                </div>
              </div>
            ))}
          </div>

          {/* Legal Questions */}
          <div className="bg-white border-2 border-black rounded p-6">
            <h2 className="text-xl font-bold mb-4 border-b-2 border-black pb-2">LEGAL AUTHORIZATION</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Are you legally authorized to work in the United States? *</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input type="radio" name="legallyAuthorized" value="yes" checked={form.legallyAuthorized === 'yes'} onChange={handleChange} required className="mr-2" />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="legallyAuthorized" value="no" checked={form.legallyAuthorized === 'no'} onChange={handleChange} className="mr-2" />
                    No
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Have you ever been convicted of a crime? *</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input type="radio" name="convicted" value="yes" checked={form.convicted === 'yes'} onChange={handleChange} required className="mr-2" />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="convicted" value="no" checked={form.convicted === 'no'} onChange={handleChange} className="mr-2" />
                    No
                  </label>
                </div>
              </div>

              {form.convicted === 'yes' && (
                <div>
                  <label className="block text-sm font-semibold mb-1">Please explain:</label>
                  <textarea name="convictedDetails" value={form.convictedDetails} onChange={handleChange} rows={3} className="w-full border px-3 py-2 rounded" />
                </div>
              )}
            </div>
          </div>

          {/* Signature */}
          <div className="bg-white border-2 border-black rounded p-6">
            <h2 className="text-xl font-bold mb-4 border-b-2 border-black pb-2">APPLICANT SIGNATURE</h2>
            <p className="text-sm text-gray-700 mb-4">
              I certify that the information provided in this application is true and complete to the best of my knowledge. 
              I understand that false information may be grounds for not hiring me or for immediate termination of employment.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Full Name (Signature) *</label>
                <input name="signature" value={form.signature} onChange={handleChange} required className="w-full border px-3 py-2 rounded font-cursive text-xl" placeholder="Type your full name" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Date *</label>
                <input name="signatureDate" type="date" value={form.signatureDate} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button type="submit" className="px-8 py-3 bg-blue-900 text-white font-bold rounded hover:bg-blue-800 transition">
              SUBMIT APPLICATION
            </button>
            <button type="button" onClick={() => window.history.back()} className="px-8 py-3 border-2 border-black text-black font-bold rounded hover:bg-gray-100 transition">
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  )
}
