// app/api/user-info/route.ts
import { userAgent } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Parse user agent from the request
        const { device, browser, os, cpu, engine, ua } = userAgent(request);

        // Get additional request information
        const ip = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            request.headers.get('remote-addr') ||
            'unknown';

        const acceptLanguage = request.headers.get('accept-language') || '';
        const referer = request.headers.get('referer') || '';

        // Build comprehensive user info object
        const userInfo = {
            // Device information
            device: {
                type: device.type || 'desktop',
                vendor: device.vendor || null,
                model: device.model || null
            },

            // Browser information
            browser: {
                name: browser.name || 'Unknown',
                version: browser.version || 'Unknown'
            },

            // Operating system information
            os: {
                name: os.name || 'Unknown',
                version: os.version || 'Unknown'
            },

            // CPU information
            cpu: {
                architecture: cpu.architecture || 'Unknown'
            },

            // Engine information
            engine: {
                name: engine.name || 'Unknown',
                version: engine.version || 'Unknown'
            },

            // Additional request information
            network: {
                ip: ip,
                userAgent: ua
            },

            // Locale and referrer
            locale: {
                acceptLanguage: acceptLanguage,
                primaryLanguage: acceptLanguage.split(',')[0]?.split('-')[0] || 'unknown'
            },

            // Request metadata
            request: {
                referer: referer,
                timestamp: new Date().toISOString(),
                url: request.url
            }
        };

        return Response.json(userInfo, {
            status: 200,
            headers: {
                'Cache-Control': 'no-store, max-age=0',
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error('Error parsing user agent:', error);

        return Response.json(
            {
                error: 'Failed to parse user information',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
