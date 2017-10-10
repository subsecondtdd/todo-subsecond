IF "%BROWSERSTACK_USER%"=="" (
  echo "set BROWSERSTACK_USER and BROWSERSTACK_KEY to run features on browserstack"
) ELSE (
  set CUCUMBER_ASSEMBLY=browserstack-memory
  node_modules\.bin\cucumber-js %*
)
