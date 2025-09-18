'use server';

/**
 * @fileOverview A route optimization AI agent that suggests route modifications to increase ride pooling.
 *
 * - optimizeRouteForPooling - A function that suggests route modifications for better ride pooling.
 * - OptimizeRouteForPoolingInput - The input type for the optimizeRouteForPooling function.
 * - OptimizeRouteForPoolingOutput - The return type for the optimizeRouteForPooling function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeRouteForPoolingInputSchema = z.object({
  currentRouteDescription: z
    .string()
    .describe('The description of the current planned route.'),
  startLocation: z.string().describe('The starting location of the route.'),
  endLocation: z.string().describe('The final destination of the route.'),
  stops: z
    .array(z.string())
    .describe('An array of stops along the route, if any.'),
  riderDemographics: z
    .string()
    .optional()
    .describe(
      'Optional information about the demographics of potential riders in the area.'
    ),
  historicalRideData: z
    .string()
    .optional()
    .describe(
      'Optional historical data on ride requests and pooling success in the area.'
    ),
});

export type OptimizeRouteForPoolingInput = z.infer<
  typeof OptimizeRouteForPoolingInputSchema
>;

const OptimizeRouteForPoolingOutputSchema = z.object({
  suggestedRouteModifications: z
    .string()
    .describe(
      'Suggested modifications to the route that would increase the likelihood of matching with other riders. Return null if there are no suggestions.'
    ),
  expectedImpact: z
    .string()
    .describe(
      'An estimate of the positive impact on overall number of riders if the suggestion is implemented.'
    ),
  justification: z
    .string()
    .describe(
      'The reasoning behind the suggested route modifications and expected impact.'
    ),
});

export type OptimizeRouteForPoolingOutput = z.infer<
  typeof OptimizeRouteForPoolingOutputSchema
>;

export async function optimizeRouteForPooling(
  input: OptimizeRouteForPoolingInput
): Promise<OptimizeRouteForPoolingOutput> {
  return optimizeRouteForPoolingFlow(input);
}

const optimizeRouteForPoolingPrompt = ai.definePrompt({
  name: 'optimizeRouteForPoolingPrompt',
  input: {schema: OptimizeRouteForPoolingInputSchema},
  output: {schema: OptimizeRouteForPoolingOutputSchema},
  prompt: `You are a route optimization expert for ride-sharing applications. Analyze the user's planned route and suggest modifications that would increase the likelihood of matching with other riders, maximizing pooled rides and reducing overall traffic. Only present suggestions if they demonstrably improve the chances of a match. Provide a justification for your suggestions and an estimate of the positive impact on overall number of riders.

Current Route Description: {{{currentRouteDescription}}}
Start Location: {{{startLocation}}}
End Location: {{{endLocation}}}
Stops: {{#each stops}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Rider Demographics (optional): {{{riderDemographics}}}
Historical Ride Data (optional): {{{historicalRideData}}}`,
});

const optimizeRouteForPoolingFlow = ai.defineFlow(
  {
    name: 'optimizeRouteForPoolingFlow',
    inputSchema: OptimizeRouteForPoolingInputSchema,
    outputSchema: OptimizeRouteForPoolingOutputSchema,
  },
  async input => {
    const {output} = await optimizeRouteForPoolingPrompt(input);
    return output!;
  }
);
