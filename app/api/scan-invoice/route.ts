import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    console.log('📸 Scanning invoice with OpenAI Vision...')

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an expert at reading restaurant supplier invoices. Extract ALL the following information from this invoice image and return it as a JSON object:

{
  "vendor": "vendor name",
  "amount": total invoice amount as number,
  "date": "YYYY-MM-DD format",
  "delivery_number": "order/delivery/invoice number",
  "payment_terms": "NET 30, NET 60, COD, etc.",
  "items": [
    {
      "product_name": "product name",
      "cases": number of cases (if mentioned),
      "bottles": number of bottles (if mentioned),
      "unit_price": price per unit as number,
      "total_price": total for this line as number
    }
  ]
}

CRITICAL RULES:
1. Extract EVERY line item from the invoice
2. For quantities, look for: "cs", "case", "cases", "bt", "bottle", "bottles", "ea", "each"
3. Cases are bulk packaging (usually 6-24 items per case)
4. Bottles are individual units
5. If quantity has no unit type, assume it's cases
6. Unit price should be per case or per bottle
7. Total price is quantity × unit price
8. Remove $ symbols and convert to numbers
9. Date must be in YYYY-MM-DD format
10. If you cannot find a field, set it to null
11. Return ONLY valid JSON, no markdown formatting

Be extremely accurate with numbers and product names.`
            },
            {
              type: "image_url",
              image_url: {
                url: image
              }
            }
          ]
        }
      ],
      max_tokens: 2000,
      temperature: 0.1
    })

    const content = response.choices[0].message.content
    console.log('🤖 OpenAI raw response:', content)

    // Parse the JSON response
    let invoiceData
    try {
      // Remove markdown code blocks if present
      let jsonContent = content?.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      
      // Remove commas from numbers (e.g., 1,160.00 -> 1160.00)
      jsonContent = jsonContent?.replace(/(\d),(\d)/g, '$1$2')
      
      invoiceData = JSON.parse(jsonContent || '{}')
    } catch (parseError) {
      console.error('❌ Failed to parse OpenAI response:', parseError)
      console.error('Raw content:', content)
      return NextResponse.json({ 
        error: 'Failed to parse invoice data',
        rawResponse: content 
      }, { status: 500 })
    }

    console.log('✅ Parsed invoice data:', invoiceData)

    return NextResponse.json({
      success: true,
      data: invoiceData
    })

  } catch (error: any) {
    console.error('❌ OpenAI API error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to scan invoice',
      details: error.response?.data || error 
    }, { status: 500 })
  }
}
