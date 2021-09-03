# Review New Projects

This plug-in does the following...

To download the plug-in...

[DownGit link](https://downgit.github.io/#/home?url=https://github.com/omni-biscuit/test/tree/main/OF-Date%20Controls.omnifocusjs) - Works for single-file and bundled plug-ins  
[Raw Link](https://raw.githubusercontent.com/omni-biscuit/test/main/OF-Review%20New%20Projects.omnifocusjs) Only works with single-file plug-ins

<button type="button" onclick="downloadFile('https://raw.githubusercontent.com/omni-biscuit/Automation-Plug-Ins/main/OmniFocus/review-new-projects/OF-Review%20New%20Projects.omnifocusjs');">Get File</button>
<script>
async function downloadFile(fileSource) {
  const file = await fetch(fileSource)
  const fileBlob = await file.blob()
  const fileURL = URL.createObjectURL(fileBlob)

  const link = document.createElement('a')
  link.href = fileURL
  link.download = 'test-file.omnijs'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>
