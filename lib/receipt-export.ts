import { toPng } from 'html-to-image'

const RECEIPT_WIDTH_PX = 302 // ~80mm at 96dpi

export async function downloadReceiptPng(element: HTMLElement, filename: string) {
  const dataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: '#ffffff',
    width: RECEIPT_WIDTH_PX,
    style: {
      width: '80mm',
      maxWidth: '80mm',
      boxSizing: 'border-box',
      margin: '0',
      overflow: 'hidden',
    },
  })
  const link = document.createElement('a')
  link.download = filename.endsWith('.png') ? filename : `${filename}.png`
  link.href = dataUrl
  link.click()
}
