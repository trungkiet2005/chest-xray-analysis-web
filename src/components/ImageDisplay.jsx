import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Download } from 'lucide-react'
import { downloadImage } from '../utils/api'

export function ImageDisplay({ originalFile, resultBlob }) {
  const originalImageUrl = originalFile ? URL.createObjectURL(originalFile) : null
  const resultImageUrl = resultBlob ? URL.createObjectURL(resultBlob) : null

  const handleDownload = () => {
    if (resultBlob) {
      downloadImage(resultBlob, `chest-xray-result-${Date.now()}.png`)
    }
  }

  if (!originalFile && !resultBlob) {
    return null
  }

  return (
    <div className="w-full space-y-6">
      {/* Desktop Layout: Side by Side */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-6">
        {/* Original Image */}
        {originalImageUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                Original X-ray
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
                <img
                  src={originalImageUrl}
                  alt="Original chest X-ray"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {originalFile.name}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Result Image */}
        {resultImageUrl && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold text-foreground">
                AI Analysis Result
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </CardHeader>
            <CardContent>
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
                <img
                  src={resultImageUrl}
                  alt="AI analysis result"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Processed by AI
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Mobile Layout: Stacked */}
      <div className="lg:hidden space-y-6">
        {/* Original Image */}
        {originalImageUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                Original X-ray
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
                <img
                  src={originalImageUrl}
                  alt="Original chest X-ray"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {originalFile.name}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Result Image */}
        {resultImageUrl && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold text-foreground">
                AI Analysis Result
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </CardHeader>
            <CardContent>
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
                <img
                  src={resultImageUrl}
                  alt="AI analysis result"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Processed by AI
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
