import React, { useState, useEffect, useRef, useCallback } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

const SCALE_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3]

const PDFViewer = ({ pdfUrl, onLoad, onError }) => {
  const [pdf, setPdf] = useState(null)
  const [numPages, setNumPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [scale, setScale] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showThumbnails, setShowThumbnails] = useState(false)
  const canvasRef = useRef(null)
  const thumbnailContainerRef = useRef(null)
  const [thumbnails, setThumbnails] = useState([])
  const renderTaskRef = useRef(null)
  const thumbRenderTaskRef = useRef(null)

  useEffect(() => {
    if (!pdfUrl) return
    setLoading(true)
    setError(null)
    setPdf(null)
    setThumbnails([])

    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({
          url: pdfUrl,
          withCredentials: true
        })
        const pdfDoc = await loadingTask.promise
        setPdf(pdfDoc)
        setNumPages(pdfDoc.numPages)
        setCurrentPage(1)
        onLoad?.(pdfDoc)
      } catch (err) {
        setError(err.message || 'Failed to load PDF')
        onError?.(err)
      } finally {
        setLoading(false)
      }
    }
    loadPdf()
  }, [pdfUrl])

  const renderPage = useCallback(async (pdfDoc, pageNum, canvas, scaleVal, renderRef) => {
    if (!pdfDoc || !canvas) return
    const ref = renderRef || renderTaskRef
    try {
      if (ref.current) {
        ref.current.cancel()
      }
      const page = await pdfDoc.getPage(pageNum)
      const viewport = page.getViewport({ scale: scaleVal })
      const ctx = canvas.getContext('2d')
      canvas.height = viewport.height
      canvas.width = viewport.width
      const renderTask = page.render({ canvasContext: ctx, viewport })
      ref.current = renderTask
      await renderTask.promise
    } catch (err) {
      if (err?.name !== 'RenderingCancelledException') throw err
    }
  }, [])

  useEffect(() => {
    if (pdf && canvasRef.current) {
      renderPage(pdf, currentPage, canvasRef.current, scale, renderTaskRef)
    }
  }, [pdf, currentPage, scale, renderPage])

  useEffect(() => {
    if (!pdf || !showThumbnails) return
    const generateThumbnails = async () => {
      const thumbs = []
      for (let i = 1; i <= Math.min(pdf.numPages, 20); i++) {
        const canvas = document.createElement('canvas')
        await renderPage(pdf, i, canvas, 0.3, thumbRenderTaskRef)
        thumbs.push({ pageNum: i, dataUrl: canvas.toDataURL() })
      }
      setThumbnails(thumbs)
    }
    generateThumbnails()
  }, [pdf, showThumbnails])

  const zoomIn = () => {
    setScale(prev => {
      const next = SCALE_STEPS.find(s => s > prev)
      return next || prev
    })
  }

  const zoomOut = () => {
    setScale(prev => {
      const next = [...SCALE_STEPS].reverse().find(s => s < prev)
      return next || prev
    })
  }

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, numPages)))
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading PDF...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-md">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-700 font-medium mb-1">Failed to load PDF</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (!pdf) return null

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            disabled={scale <= 0.5}
            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded disabled:opacity-40"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </button>
          <span className="text-sm text-gray-600 min-w-[4rem] text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={zoomIn}
            disabled={scale >= 3}
            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded disabled:opacity-40"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </button>
          <div className="w-px h-5 bg-gray-300 mx-2" />
          <button
            onClick={() => setShowThumbnails(v => !v)}
            className={`p-1.5 rounded ${showThumbnails ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
            title="Thumbnails"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded disabled:opacity-40"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm text-gray-600">
            <input
              type="number"
              value={currentPage}
              onChange={(e) => goToPage(Number(e.target.value))}
              className="w-12 text-center border border-gray-300 rounded px-1 py-0.5 text-sm"
              min={1}
              max={numPages}
            />
            {' '}/ {numPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= numPages}
            className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded disabled:opacity-40"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.open(pdfUrl, '_blank')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
            title="Open in new tab"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
          <a
            href={pdfUrl}
            download
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
            title="Download"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </a>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
            title="Print"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {showThumbnails && (
          <div ref={thumbnailContainerRef} className="w-48 overflow-y-auto border-r border-gray-200 bg-white p-2 space-y-2">
            {thumbnails.map(t => (
              <button
                key={t.pageNum}
                onClick={() => { setCurrentPage(t.pageNum); setShowThumbnails(false) }}
                className={`w-full block border-2 rounded overflow-hidden transition-colors ${t.pageNum === currentPage ? 'border-blue-500' : 'border-transparent hover:border-gray-300'}`}
              >
                <img src={t.dataUrl} alt={`Page ${t.pageNum}`} className="w-full" />
                <p className="text-xs text-center text-gray-500 py-1">{t.pageNum}</p>
              </button>
            ))}
          </div>
        )}
        <div className="flex-1 overflow-auto bg-gray-200 flex items-start justify-center p-4">
          <canvas ref={canvasRef} className="shadow-xl bg-white" />
        </div>
      </div>
    </div>
  )
}

export default PDFViewer
