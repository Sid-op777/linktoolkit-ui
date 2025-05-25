
import React, { useState } from 'react';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { LinkIcon } from '@/components/LinkIcon';
import { PuzzlePieceIcon } from '@/components/PuzzlePieceIcon';
import { UTMParams, ToastType } from '../../../../types';
import { buildUtmUrl } from '@/services/apiService';
import { useToast } from '@/context/ToastContext';
import { ClipboardIcon } from '@/components/ClipboardIcon';

const predefinedTemplates = [
  { name: "Select Template...", values: {} },
  { name: "Social Media Campaign", values: { medium: "social", source: "platform-name" } },
  { name: "Email Newsletter", values: { medium: "email", source: "newsletter", campaign: "monthly-promo" } },
  { name: "PPC Ad", values: { medium: "cpc", source: "googleads", campaign: "product-launch" } },
];

export const UTMForm: React.FC = () => {
  const [params, setParams] = useState<UTMParams>({ baseUrl: '' });
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: value }));
    setGeneratedUrl(''); // Clear generated URL when params change
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTemplate = predefinedTemplates.find(t => t.name === e.target.value);
    if (selectedTemplate && selectedTemplate.values) {
      setParams(prev => ({
        ...prev,
        ...selectedTemplate.values,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!params.baseUrl.trim()) {
      setError('Base URL is required.');
      return;
    }
    try {
      new URL(params.baseUrl); // Basic validation
    } catch (_) {
      setError('Please enter a valid Base URL (e.g., https://example.com).');
      return;
    }

    setIsLoading(true);
    try {
      const result = await buildUtmUrl(params);
      setGeneratedUrl(result.utmUrl);
      addToast('UTM URL generated!', ToastType.Success);
    } catch (apiError) {
      console.error("UTM generation error:", apiError);
      const message = apiError instanceof Error ? apiError.message : 'Failed to generate UTM URL.';
      setError(message);
      addToast(message, ToastType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl)
      .then(() => addToast('UTM URL copied!', ToastType.Success))
      .catch(() => addToast('Failed to copy URL.', ToastType.Error));
  };

  return (
    <div className="p-6 bg-slate-800 rounded-lg shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="baseUrl"
          name="baseUrl"
          label="Base URL"
          type="url"
          placeholder="https://yourwebsite.com/page"
          value={params.baseUrl}
          onChange={handleChange}
          Icon={LinkIcon}
          required
          disabled={isLoading}
        />

        <div>
          <label htmlFor="template" className="block text-sm font-medium text-slate-300 mb-1">
            Load Template (Optional)
          </label>
          <select
            id="template"
            name="template"
            onChange={handleTemplateChange}
            className="block w-full appearance-none rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
            disabled={isLoading}
          >
            {predefinedTemplates.map(template => (
              <option key={template.name} value={template.name}>{template.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input name="source" label="Campaign Source (utm_source)" placeholder="e.g., google, newsletter" value={params.source || ''} onChange={handleChange} disabled={isLoading} />
          <Input name="medium" label="Campaign Medium (utm_medium)" placeholder="e.g., cpc, email, social" value={params.medium || ''} onChange={handleChange} disabled={isLoading} />
          <Input name="campaign" label="Campaign Name (utm_campaign)" placeholder="e.g., product_launch, summer_sale" value={params.campaign || ''} onChange={handleChange} disabled={isLoading} />
          <Input name="term" label="Campaign Term (utm_term)" placeholder="Keywords for paid search" value={params.term || ''} onChange={handleChange} disabled={isLoading} />
          <Input name="content" label="Campaign Content (utm_content)" placeholder="Differentiate ads or links" value={params.content || ''} onChange={handleChange} disabled={isLoading} />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        
        <Button type="submit" variant="primary" size="lg" className="w-full flex items-center justify-center gap-2" isLoading={isLoading}>
          <PuzzlePieceIcon className="w-5 h-5" /> Generate UTM URL
        </Button>
      </form>

      {generatedUrl && (
        <div className="mt-8 p-4 bg-slate-700 rounded-md">
          <h3 className="text-lg font-semibold text-slate-100 mb-2">Generated UTM URL:</h3>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={generatedUrl}
              readOnly
              className="text-sm flex-grow bg-slate-600 border-slate-500"
            />
            <Button onClick={handleCopy} variant="secondary" size="sm" className="flex items-center gap-1">
              <ClipboardIcon className="w-4 h-4" /> Copy
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
