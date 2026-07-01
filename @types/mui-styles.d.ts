import '@mui/styles'

declare module '@mui/styles/makeStyles' {
  export default function makeStyles<Theme = unknown, Props extends object = {}, ClassKey extends string = string>(
    styles: any,
    options?: any,
  ): (props?: any) => Record<ClassKey, string>
}
