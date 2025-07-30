
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Upload, 
  Search, 
  Filter,
  Folder,
  File,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import { Document, DocumentStats, DOCUMENT_TAGS } from '@/lib/types';
import { AddDocumentModal } from '@/components/add-document-modal';

export function DocumentsDashboard() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState<DocumentStats>({
    total: 0,
    byCategory: {},
    byType: {},
    totalSize: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);

  useEffect(() => {
    fetchDocumentsData();
  }, []);

  const fetchDocumentsData = async () => {
    try {
      // Fetch documents
      const documentsResponse = await fetch('/api/documents');
      if (documentsResponse.ok) {
        const documentsData = await documentsResponse.json();
        setDocuments(documentsData);
        calculateStats(documentsData);
      }
    } catch (error) {
      console.error('Failed to fetch documents data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (documentsData: Document[]) => {
    const stats: DocumentStats = {
      total: documentsData.length,
      byCategory: {},
      byType: {},
      totalSize: 0
    };

    documentsData.forEach(doc => {
      // Category stats
      stats.byCategory[doc.category] = (stats.byCategory[doc.category] || 0) + 1;
      
      // File type stats - extract from mime type
      const fileType = doc.mimeType?.split('/')[1]?.toUpperCase() || 'UNKNOWN';
      stats.byType[fileType] = (stats.byType[fileType] || 0) + 1;
      
      // Total size (convert from bytes to MB)
      stats.totalSize += doc.fileSize / (1024 * 1024);
    });

    // Round total size to 2 decimal places
    stats.totalSize = Math.round(stats.totalSize * 100) / 100;

    setStats(stats);
  };

  const handleDocumentAdded = () => {
    fetchDocumentsData();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'INVOICE': return 'bg-blue-100 text-blue-800';
      case 'RECEIPT': return 'bg-green-100 text-green-800';
      case 'MANUAL': return 'bg-purple-100 text-purple-800';
      case 'WARRANTY': return 'bg-orange-100 text-orange-800';
      case 'SERVICE_RECORD': return 'bg-red-100 text-red-800';
      case 'CERTIFICATE': return 'bg-yellow-100 text-yellow-800';
      case 'POLICY': return 'bg-indigo-100 text-indigo-800';
      case 'PROCEDURE': return 'bg-pink-100 text-pink-800';
      case 'TRAINING': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return <FileText className="h-8 w-8 text-red-500" />;
    if (mimeType.includes('word')) return <FileText className="h-8 w-8 text-blue-500" />;
    if (mimeType.includes('excel')) return <FileText className="h-8 w-8 text-green-500" />;
    if (mimeType.includes('image')) return <FileText className="h-8 w-8 text-purple-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center animate-fade-in">
          <FileText className="h-12 w-12 text-hct-teal mx-auto mb-4 animate-pulse" />
          <p className="text-lg font-medium">Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-hct-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-hct-teal">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">Files stored</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
            <Folder className="h-4 w-4 text-hct-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-hct-blue">{Object.keys(stats.byCategory).length}</div>
            <p className="text-xs text-muted-foreground mt-1">Document types</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">File Types</CardTitle>
            <File className="h-4 w-4 text-hct-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-hct-purple">{Object.keys(stats.byType).length}</div>
            <p className="text-xs text-muted-foreground mt-1">Different formats</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Size</CardTitle>
            <Upload className="h-4 w-4 text-hct-green" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-hct-green">{stats.totalSize} MB</div>
            <p className="text-xs text-muted-foreground mt-1">Storage used</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Documents</CardTitle>
                <Button 
                  onClick={() => setShowAddDocumentModal(true)}
                  className="bg-hct-teal hover:bg-hct-teal/90"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              
              {documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        {getFileIcon(doc.mimeType)}
                        <div>
                          <p className="font-medium">{doc.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(doc.createdAt).toLocaleDateString()} • {formatFileSize(doc.fileSize)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getCategoryColor(doc.category)}>{doc.category}</Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No documents found</h3>
                  <p className="text-muted-foreground mb-6">
                    Start building your document repository by uploading your first document.
                  </p>
                  <Button 
                    onClick={() => setShowAddDocumentModal(true)}
                    className="bg-hct-teal hover:bg-hct-teal/90"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload First Document
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Document Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(stats.byCategory).map(([category, count]) => (
                  <div key={category} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Folder className="h-5 w-5 text-hct-blue" />
                        <h4 className="font-medium">{category.replace('_', ' ')}</h4>
                      </div>
                      <Badge className={getCategoryColor(category)}>{count}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {count} documents in this category
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Recent Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.length > 0 ? (
                  documents
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5)
                    .map((doc) => {
                      const uploadedDate = new Date(doc.createdAt);
                      const now = new Date();
                      const diffTime = Math.abs(now.getTime() - uploadedDate.getTime());
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      
                      let timeAgo = '';
                      if (diffDays === 0) {
                        timeAgo = 'Today';
                      } else if (diffDays === 1) {
                        timeAgo = 'Yesterday';
                      } else if (diffDays < 7) {
                        timeAgo = `${diffDays} days ago`;
                      } else {
                        timeAgo = uploadedDate.toLocaleDateString();
                      }

                      return (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            {getFileIcon(doc.mimeType)}
                            <div>
                              <p className="font-medium">{doc.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {timeAgo} • {formatFileSize(doc.fileSize)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getCategoryColor(doc.category)}>{doc.category}</Badge>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No recent documents</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <Upload className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Drag & drop files here</h3>
                <p className="text-muted-foreground mb-6">
                  Or click to browse and select files from your computer
                </p>
                <Button 
                  onClick={() => setShowAddDocumentModal(true)}
                  className="bg-hct-teal hover:bg-hct-teal/90"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Supported formats: PDF, DOCX, XLSX, PNG, JPG (Max 10MB per file)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Advanced Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents by name, content, or tags..."
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium">Category</label>
                    <select className="w-full mt-1 border rounded-md px-3 py-2">
                      <option value="">All Categories</option>
                      <option value="INVOICE">Invoice</option>
                      <option value="RECEIPT">Receipt</option>
                      <option value="MANUAL">Manual</option>
                      <option value="WARRANTY">Warranty</option>
                      <option value="SERVICE_RECORD">Service Record</option>
                      <option value="CERTIFICATE">Certificate</option>
                    </select>
                  </div>
                  
                  <div className="flex-1">
                    <label className="text-sm font-medium">File Type</label>
                    <select className="w-full mt-1 border rounded-md px-3 py-2">
                      <option value="">All Types</option>
                      <option value="pdf">PDF</option>
                      <option value="docx">Word Document</option>
                      <option value="xlsx">Excel Spreadsheet</option>
                      <option value="image">Image</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium">Date From</label>
                    <Input type="date" className="mt-1" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium">Date To</label>
                    <Input type="date" className="mt-1" />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {DOCUMENT_TAGS.map(tag => (
                      <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-muted">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button className="w-full bg-hct-teal hover:bg-hct-teal/90">
                  <Search className="h-4 w-4 mr-2" />
                  Search Documents
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Document Modal */}
      <AddDocumentModal
        open={showAddDocumentModal}
        onClose={() => setShowAddDocumentModal(false)}
        onSuccess={handleDocumentAdded}
      />
    </div>
  );
}
