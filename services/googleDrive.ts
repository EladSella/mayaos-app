import { SearchResult, DocType } from '../types';

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';
const TARGET_DRIVE_ID = import.meta.env.VITE_TARGET_DRIVE_ID;

let tokenClient: any;
let gapiInited = false;
let gisInited = false;

export const initGoogleClient = (callback: (user: any) => void) => {
    const script1 = document.createElement('script');
    script1.src = "https://apis.google.com/js/api.js";
    script1.async = true;
    script1.defer = true;
    script1.onload = () => {
        (window as any).gapi.load('client', async () => {
            await (window as any).gapi.client.init({
                apiKey: API_KEY,
                discoveryDocs: DISCOVERY_DOCS,
            });
            gapiInited = true;
            checkAuth(callback);
        });
    };
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = "https://accounts.google.com/gsi/client";
    script2.async = true;
    script2.defer = true;
    script2.onload = () => {
        tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: async (resp: any) => {
                if (resp.error !== undefined) {
                    throw (resp);
                }
                await checkAuth(callback);
            },
        });
        gisInited = true;
    };
    document.body.appendChild(script2);
};

const checkAuth = async (callback: (user: any) => void) => {
    // Simple check if we have a valid token (this is a simplified approach)
    // In a real app, we'd manage token expiration
    const token = (window as any).gapi?.client?.getToken();
    if (token && gapiInited && gisInited) {
        // Fetch user info using Drive API "about" or simple profile if available. 
        // For simplicity, we just return a dummy user object if token exists, 
        // or we could fetch the user's name/photo via People API if scope added.
        // Here we just signal "connected"
        callback({
            id: 'google-user',
            name: 'Google User',
            email: 'user@google.com',
            avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
        });
    }
};

export const handleAuthClick = () => {
    if (tokenClient) {
        if ((window as any).gapi.client.getToken() === null) {
            tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
            tokenClient.requestAccessToken({ prompt: '' });
        }
    }
};

export const handleSignOutClick = (callback: () => void) => {
    const token = (window as any).gapi.client.getToken();
    if (token !== null) {
        (window as any).google.accounts.oauth2.revoke(token.access_token, () => {
            (window as any).gapi.client.setToken('');
            callback();
        });
    }
};

export const searchDrive = async (query: string, filter: string = 'all'): Promise<SearchResult[]> => {
    if (!gapiInited) return [];

    try {
        // Base query: not trashed and not a folder (unless looking for folders, but usually we exclude them in results)
        let q = `trashed = false and mimeType != 'application/vnd.google-apps.folder'`;

        // Add Filter Logic
        if (filter === 'docs') {
            q += ` and mimeType = 'application/vnd.google-apps.document'`;
        } else if (filter === 'sheets') {
            q += ` and mimeType = 'application/vnd.google-apps.spreadsheet'`;
        } else if (filter === 'decks') {
            q += ` and mimeType = 'application/vnd.google-apps.presentation'`;
        }
        // Note: 'people' filter is not directly supported by Drive file search in this context. 
        // We could implement a People API call later, or just return empty for now if strictly file search.

        if (query) {
            // Escape single quotes in query
            const sanitizedQuery = query.replace(/'/g, "\\'");
            q += ` and name contains '${sanitizedQuery}'`;
        }

        const response = await (window as any).gapi.client.drive.files.list({
            'pageSize': 20,
            'fields': "nextPageToken, files(id, name, mimeType, webViewLink, iconLink, modifiedTime, owners, lastModifyingUser)",
            'q': q,
            'supportsAllDrives': true,
            'includeItemsFromAllDrives': true,
            'driveId': TARGET_DRIVE_ID,
            'corpora': 'drive'
        });

        const files = response.result.files;
        if (!files || files.length === 0) {
            return [];
        }

        return files.map((file: any) => ({
            id: file.id,
            title: file.name,
            snippet: `Modified by ${file.lastModifyingUser?.displayName || 'someone'}`,
            type: mapMimeTypeToDocType(file.mimeType),
            updatedAt: new Date(file.modifiedTime).toLocaleDateString(),
            owner: file.owners?.[0]?.displayName || 'Unknown',
            url: file.webViewLink,
            location: 'Shared Drive'
        }));

    } catch (error) {
        console.error("Drive API Error", error);
        return [];
    }
};

const mapMimeTypeToDocType = (mimeType: string): DocType => {
    if (mimeType.includes('spreadsheet')) return DocType.SHEET;
    if (mimeType.includes('presentation')) return DocType.SLIDE;
    if (mimeType.includes('document')) return DocType.DOC;
    if (mimeType.includes('pdf')) return DocType.PDF;
    if (mimeType.includes('folder')) return DocType.FOLDER;
    return DocType.DOC;
};
