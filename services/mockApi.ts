import { DocType, EventType, FeedEvent, SearchResult } from "../types";

// Mock Data Store
const MOCK_DOCS: SearchResult[] = [
    {
        id: '1',
        title: 'Q3 Financial Overview 2024',
        snippet: 'Summary of <span class="bg-yellow-100 text-yellow-800 px-1 rounded">revenue growth</span> across APAC regions showing a 15% increase year-over-year...',
        type: DocType.SHEET,
        updatedAt: '2 hours ago',
        owner: 'Finance Team',
        url: '#',
        location: 'Shared Drives / Finance / Q3'
    },
    {
        id: '2',
        title: 'Project Neukleos: Product Spec v1.2',
        snippet: '...defines the core UX requirements for the <strong>OS dashboard</strong> including search latency targets...',
        type: DocType.DOC,
        updatedAt: 'Yesterday',
        owner: 'Product',
        url: '#',
        location: 'Client Work / Neukleos / Specs'
    },
    {
        id: '3',
        title: 'Holiday Party Logistics',
        snippet: 'Venue confirmation and catering options for the December event.',
        type: DocType.SLIDE,
        updatedAt: '3 days ago',
        owner: 'People Ops',
        url: '#',
        location: 'Internal / Culture'
    },
    {
        id: '4',
        title: 'Remote Work Policy 2025',
        snippet: 'Updated guidelines for hybrid work arrangements effective Jan 1st.',
        type: DocType.PDF,
        updatedAt: '1 week ago',
        owner: 'HR',
        url: '#',
        location: 'All Company / Policies'
    }
];

const MOCK_EVENTS: FeedEvent[] = [
    {
        id: '1',
        type: EventType.BIRTHDAY,
        title: 'Sarah\'s Birthday',
        body: 'Wish Sarah (Design) a happy birthday today! 🎂',
        timestamp: 'Today, 9:00 AM'
    },
    {
        id: '2',
        type: EventType.OPS,
        title: 'Office WiFi Maintenance',
        body: 'Network downtime expected from 6pm-7pm tonight for upgrades.',
        timestamp: 'Today, 10:30 AM'
    },
    {
        id: '3',
        type: EventType.CELEBRATION,
        title: 'New Client Win: Acme Corp',
        body: 'Congrats to the sales team for closing the Acme deal!',
        timestamp: 'Yesterday'
    },
    {
        id: '4',
        type: EventType.HR,
        title: 'Open Enrollment',
        body: 'Benefits selection closes this Friday. Don\'t forget!',
        timestamp: '2 days ago'
    }
];

export const mockSearch = async (query: string, filter: string): Promise<SearchResult[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (!query) {
                // Return "Recents"
                resolve(MOCK_DOCS);
                return;
            }

            const q = query.toLowerCase();
            const filtered = MOCK_DOCS.filter(doc => {
                const matchesQuery = doc.title.toLowerCase().includes(q) || doc.snippet.toLowerCase().includes(q);
                const matchesFilter = filter === 'all' || 
                                     (filter === 'docs' && doc.type === DocType.DOC) ||
                                     (filter === 'sheets' && doc.type === DocType.SHEET) ||
                                     (filter === 'decks' && doc.type === DocType.SLIDE);
                return matchesQuery && matchesFilter;
            });
            resolve(filtered);
        }, 300 + Math.random() * 200); // Simulate 300-500ms latency
    });
};

export const mockFeed = async (): Promise<FeedEvent[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_EVENTS);
        }, 200);
    });
};