module.exports = {
  makers: [
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'linux','win32'],
    },
    {
      "name": "@electron-forge/maker-squirrel",
      config: {
        name: "camera_control",
      }
    }
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'ThijsOnGitHup',
          name: 'camera-control'
        },
        prerelease: false,
        draft: false,
      }
    }
  ]
}