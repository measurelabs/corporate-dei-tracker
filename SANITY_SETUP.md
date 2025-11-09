# Sanity CMS Setup for News & Insights

This guide will help you set up Sanity CMS for managing articles on the News & Insights page.

## Quick Start

### 1. Create a Sanity Project

1. Go to [sanity.io](https://www.sanity.io/) and sign up/log in
2. Create a new project:
   - Click "Create new project"
   - Choose a project name (e.g., "Corporate DEI Tracker")
   - Select a dataset name (use "production")
   - Keep the project ID that's generated

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Sanity credentials:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token_here
```

**Getting your credentials:**

1. **Project ID**: Find it in the Sanity dashboard at https://www.sanity.io/manage
2. **API Token** (optional but recommended):
   - Go to https://www.sanity.io/manage
   - Select your project
   - Go to "API" > "Tokens"
   - Click "Add API token"
   - Give it a name (e.g., "Production Read Token")
   - Set permissions to "Viewer" for read-only access
   - Copy the token and add it to your `.env.local`

**Note**: The API token is optional if your dataset is public, but recommended for better security and access control.

### 3. Initialize Sanity Studio

Run the Sanity development server:

```bash
npm run sanity
```

This will start the Sanity Studio at `http://localhost:3333`

### 4. Start Creating Content

1. Open Sanity Studio at `http://localhost:3333`
2. Click on "Article" in the sidebar
3. Click "Create new Article"
4. Fill in the article details:
   - **Title**: The article headline
   - **Slug**: Auto-generated from the title (click "Generate" button)
   - **Author**: Your name or organization name
   - **Main Image**: Upload a featured image
   - **Category**: Choose from predefined categories
   - **Tags**: Add relevant tags
   - **Published At**: Set the publication date/time
   - **Excerpt**: Write a short summary (max 200 characters)
   - **Body**: Write your article content using the rich text editor
   - **Featured Article**: Toggle this to feature the article prominently
   - **Related Companies**: Add company names/IDs related to the article

5. Click "Publish" when ready

## Article Schema

The article schema includes the following fields:

### Required Fields
- **Title**: Article headline
- **Slug**: URL-friendly identifier
- **Author**: Article author name
- **Category**: One of:
  - DEI Policy
  - Layoffs
  - Restructuring
  - Commitment Changes
  - Legal
  - Leadership
  - Analysis
  - Industry Trends
- **Published At**: Publication date/time
- **Excerpt**: Short summary (max 200 chars)
- **Body**: Rich text content with formatting, images, and links

### Optional Fields
- **Main Image**: Featured image with alt text
- **Tags**: Array of string tags
- **Featured**: Boolean to feature the article
- **Related Companies**: Array of company identifiers

## Rich Text Features

The article body supports:

### Text Formatting
- **Headings**: H2, H3, H4
- **Bold** and *italic* text
- `Code` inline formatting
- Blockquotes
- Links to external URLs

### Media
- Inline images with captions and alt text
- Image positioning and sizing

## Viewing Your Articles

Once you've published articles in Sanity Studio:

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/news`

3. You should see your published articles!

## Featured Articles

Articles marked as "Featured" will appear in a special section at the top of the News & Insights page. Up to 3 featured articles are displayed.

## Filtering by Category

The News & Insights page includes category filters that allow users to view articles by topic. Categories are defined in the article schema.

## Individual Article Pages

Each article has its own page at `/news/[slug]`. The page displays:
- Full article content with rich text formatting
- Author and publication date
- Category and tags
- Related companies (with links to company pages)
- Share functionality

## Production Deployment

### Deploy Sanity Studio

To deploy your Sanity Studio to the cloud:

```bash
npm run sanity:deploy
```

This will deploy your studio to `https://your-project.sanity.studio`

### CORS Configuration

If you deploy to production, configure CORS in Sanity:

1. Go to https://www.sanity.io/manage
2. Select your project
3. Go to "Settings" > "API"
4. Add your production domain to "CORS Origins"

## Content Management Tips

### Writing Effective Articles

1. **Clear Headlines**: Make titles descriptive and engaging
2. **Strong Excerpts**: Write compelling summaries that encourage clicks
3. **Use Categories**: Properly categorize articles for better filtering
4. **Add Tags**: Use relevant tags for discoverability
5. **Include Images**: Visual content increases engagement
6. **Link Companies**: Connect articles to relevant company profiles

### SEO Best Practices

- Write descriptive alt text for all images
- Use headings (H2, H3) to structure content
- Keep excerpts concise but informative
- Use relevant keywords naturally in content
- Add internal links to related companies

### Content Schedule

Consider publishing:
- Weekly industry analysis
- Breaking news as it happens
- Monthly trend reports
- Quarterly deep dives

## Troubleshooting

### Articles Not Showing Up

1. Check that articles are published (not drafts)
2. Verify environment variables are set correctly
3. Ensure the project ID and dataset match
4. Check browser console for API errors

### Images Not Loading

1. Verify image upload was successful in Sanity Studio
2. Check that image URLs are being generated correctly
3. Ensure CORS is configured for your domain

### Studio Not Starting

1. Verify Sanity is installed: `npm list sanity`
2. Check that `sanity.config.ts` exists
3. Ensure environment variables are set

## Additional Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Portable Text Guide](https://www.sanity.io/docs/presenting-block-text)
- [Next.js with Sanity](https://www.sanity.io/guides/sanity-nextjs-guide)

## Support

For issues with Sanity CMS integration, check:
- Sanity logs in the Studio
- Browser console for client-side errors
- Next.js terminal for server-side errors
